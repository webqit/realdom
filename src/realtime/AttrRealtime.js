
/**
 * @imports
 */
import Realtime from './Realtime.js';

/**
 *
 * @class AttrRealtime
 */
export default class AttrRealtime extends Realtime {

	/**
	 * @constructor
	 */
	constructor( context, ...args ) {
		super( context, 'attr', ...args );
	}
	
	/**
	 * Runs a query.
	 *
	 * @param array|string				filter
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Disconnectable|Void
	 */
	get( filter, callback = undefined, params = {} ) {
		const originalFilterIsString = typeof filter === 'string';
		[ filter = [], callback = undefined, params = {} ] = this.resolveArgs( arguments );
		const { context } = this;
		// -------------
		const records = attrIntersection( context, filter );
		const record_s = originalFilterIsString ? records[ 0 ] : records;
		if ( !callback ) return record_s;
		const signalGenerator = callback && params.lifecycleSignals && this.createSignalGenerator();
		const flags = signalGenerator?.generate() || {};
		callback( record_s, flags, context );
		// -------------
		if ( params.live ) {
			if ( signalGenerator ) { params = { ...params, signalGenerator }; }
			const disconnectable_live = this.observe( originalFilterIsString ? filter[ 0 ] : filter, callback, { newValue: true, ...params } );
			return this.disconnectables( params.signal, disconnectable_live );
		}
	}

	/**
	 * Mutation Observer
	 * 
	 * @param array|string				filter
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observe( filter, callback, params = {} ) {
		const originalFilterIsString = typeof filter === 'string';
		[ filter = [], callback, params = {} ] = this.resolveArgs( arguments );
		// ------------------------
		if ( [ 'sync', 'intercept' ].includes( params.timing ) ) return this.observeSync( originalFilterIsString ? filter[ 0 ] : filter, callback, params );
		if ( params.timing && params.timing !== 'async' ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		// ------------------------
		const { context, window, wq } = this;
		// ------------------
		if ( params.eventDetails && !wq.attrInterceptionHooks?.intercepting ) {
			attrInterception.call( window, 'intercept', () => {} );
		}
		// -------------
		const disconnectable = new window.MutationObserver( records => {
			records = dedup( records ).map( rcd => withAttrEventDetails.call( window, rcd ) );
			dispatch.call( window, registration, records, context );
		} );
		// ------------------
		const $params = { attributes: true, attributeOldValue: params.oldValue, subtree: params.subtree };
		if ( filter.length ) { $params.attributeFilter = filter; }
		disconnectable.observe( context, $params );
		// -------------
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, filter, callback, params, atomics: new Map, originalFilterIsString, signalGenerator, disconnectable };
		// -------------
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}
	
	/**
	 * Mutation Interceptor
	 * 
	 * @param array|string				filter
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observeSync( filter, callback, params = {} ) {
		const originalFilterIsString = typeof filter === 'string';
		[ filter, callback, params = {} ] = this.resolveArgs( arguments );
		const { context, window } = this;
		// -------------
		if ( params.timing && ![ 'sync', 'intercept' ].includes( params.timing ) ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		const interceptionTiming = params.timing === 'intercept' ? 'intercept' : 'sync';
		const intersectionDepth = params.subtree ? 'subtree' : 'children';
		if ( !this.registry( interceptionTiming ).size ) {
			// One handler per intercept/sync registry
			attrInterception.call( window, interceptionTiming, records => {
				this.forEachMatchingContext( interceptionTiming, records, dispatch );
			} );
		}
		// -------------
		const disconnectable = { disconnect() {
			registry.delete( registration );
			if ( !registry.size ) { registries.delete( context ); }
		} };
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, filter, callback, params, atomics: new Map, originalFilterIsString, signalGenerator, disconnectable };
		// -------------
		const registries = this.registry( interceptionTiming, intersectionDepth );
		if ( !registries.has( context ) ) { registries.set( context, new Set ); }
		const registry = registries.get( context );
		registry.add( registration );
		// -------------
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}
}

/**
 * Deduplicates records.
 * 
 * @param Array 			records
 * 
 * @returns Array
 */
function dedup( records ) {
	return records.reduce( ( rcds, rcd, i ) => {
		if ( rcds[ i - 1 ]?.attributeName === rcd.attributeName ) return rcds;
		return rcds.concat( rcd );
	}, [] );
}

/**
 * Dispatches a mutation record if it matches the observed.
 * 
 * @param Object 			registration
 * @param Array 			records
 * 
 * @returns Void
 */
function dispatch( registration, records ) {
	const { context, filter, callback, params, atomics, originalFilterIsString, signalGenerator } = registration;
	if ( params.atomic && !atomics.size ) {
		records = attrIntersection( context, filter, records );
	}
	// Should we care about old / new values being present?
	if ( !( params.newValue === null && params.oldValue === null ) ) {
		records = records.map( rcd => {
			let exclusion;
			if ( !params.oldValue && ( 'oldValue' in rcd ) ) {
				( { oldValue: exclusion, ...rcd } = rcd );
			}
			if ( !params.newValue && ( 'value' in rcd ) ) {
				( { value: exclusion, ...rcd } = rcd );
			} else if ( params.newValue && typeof rcd.value === 'undefined' ) {
				rcd = {  ...rcd, value: rcd.target.getAttribute( rcd.name ) };
			}
			return rcd;
		} );
	}
	if ( params.atomic ) {
		records.forEach( record => atomics.set( record.name, record ) );
		records = Array.from( atomics.entries() ).map( ( [ , value ] ) => value );
	}
	const record_s = originalFilterIsString ? records[ 0 ] : records;
	const flags = signalGenerator?.generate() || {};
	callback( record_s, flags, context );
}

/**
 * Helper to determining which records to deliver.
 * 
 * @param Object 			context
 * @param Array 			filter
 * @param Array 			records
 * 
 * @returns Array
 */
function attrIntersection( context, filter, records = [] ) {
	const _type = { event: null, type: 'attribute' };
	if ( filter.length ) {
		return filter.map( attrName => {
			return records.find( r => r.name === attrName ) || { target: context, name: attrName, value: context.getAttribute( attrName ), ..._type };
		} );
	}
	const attrs = Array.from( context.attributes );
	return attrs.map( attr => {
		return records.find( r => r.name === attr.nodeName ) || { target: context, name: attr.nodeName, value: attr.nodeValue, ..._type };
	} );
}

/**
 * Determines the event for an attr mutation record.
 * 
 * @param MutationRecord 	{ target, attributeName }
 * 
 * @returns Object
 */
function withAttrEventDetails( { target, attributeName, value, oldValue } ) {
	const window = this, registry = window.wq.attrInterceptionRecords?.get( target ) || {};
	const event = registry[ attributeName ] || 'mutation';
	const record = { target, name: attributeName, value, oldValue, type: 'observation', event };
	return record;
}

/**
 * Attributes intersection engine.
 * 
 * @param String 			timing 
 * @param Function 			callback 
 * 
 * @returns 
 */
function attrInterception( timing, callback ) {
	const window = this;
	const { wq, document, Element } = window;
	if ( !wq.attrInterceptionHooks ) { wq.attrInterceptionHooks = new Map; }
	if ( !wq.attrInterceptionHooks.has( timing ) ) { wq.attrInterceptionHooks.set( timing, new Set ); }
	wq.attrInterceptionHooks.get( timing ).add( callback );
	const rm = () => wq.attrInterceptionHooks.get( timing ).delete( callback );
	if ( wq.attrInterceptionHooks?.intercepting ) return rm;
	console.warn( `Attr mutation APIs are now being intercepted.` );
	wq.attrInterceptionHooks.intercepting = true;
	wq.attrInterceptionRecords = new Map;

	// Interception hooks
	const attrIntercept = ( record, defaultAction ) => {
		if ( !wq.attrInterceptionRecords.has( record.target ) ) { wq.attrInterceptionRecords.set( record.target, {} ); }
		const registry = wq.attrInterceptionRecords.get( record.target );
		// ------------------
		clearTimeout( registry[ record.name ]?.timeout ); // Clear any previous that's still active
		registry[ record.name ] = record.event; // Main: set event details... and next to timeout details
		const timeout = setTimeout( () => { delete registry[ record.name ]; }, 0 );
		Object.defineProperty( record.event, 'timeout', { value: timeout, configurable: true } );
		// ------------------
		wq.attrInterceptionHooks.get( 'intercept' )?.forEach( callback => callback( [ record ] ) );
		const returnValue = defaultAction();
		wq.attrInterceptionHooks.get( 'sync' )?.forEach( callback => callback( [ record ] ) );
		return returnValue;
	};

	// Interception observer WILL need to know non-API-based mutations
	const mo = new window.MutationObserver( records => {
		records = dedup( records ).map( rcd => withAttrEventDetails.call( window, rcd ) ).filter( ( rcd, i ) => {
			return !Array.isArray( rcd.event );
		} );
		if ( !records.length ) return;
		wq.attrInterceptionHooks.get( 'intercept' )?.forEach( callback => callback( records ) );
		wq.attrInterceptionHooks.get( 'sync' )?.forEach( callback => callback( records ) );
	} );
	mo.observe( document, { attributes: true, subtree: true, attributeOldValue: true } );

	// Intercept DOM attr mutation methods
	const originalApis = Object.create( null );
	[ 'setAttribute', 'removeAttribute', 'toggleAttribute', ].forEach( apiName => {
		originalApis[ apiName ] = Element.prototype[ apiName ];
		Element.prototype[ apiName ] = function( ...args ) {
			let value, oldValue = this.getAttribute( args[ 0 ] );
			if ( [ 'setAttribute', 'toggleAttribute' ].includes( apiName ) ) { value = args[ 1 ]; }
			if ( apiName === 'toggleAttribute' && value === undefined ) {
				value = oldValue === null ? true : false;
			}
			const record = { target: this, name: args[ 0 ], value, oldValue, type: 'interception', event: [ this, apiName ] };
			const exec = () => originalApis[ apiName ].call( this, ...args );
			return attrIntercept( record, exec );
		}
	} );

	return rm;
}
