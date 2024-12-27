
/**
 * @imports
 */
import { _internals } from '@webqit/util/js/index.js';
import Realtime from './Realtime.js';
import DOMSpec from './DOMSpec.js';

/**
 *
 * @class AttrRealtime
 */
export default class AttrRealtime extends Realtime {

	type = 'attr';

	/**
	 * @constructor
	 */
	constructor( context, ...args ) {
		super( context, 'attr', ...args );
	}
	
	/**
	 * Runs a query.
	 *
	 * @param array|string				spec
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Disconnectable|Void
	 */
	get( spec, callback = undefined, params = {} ) {
		const originalFilterIsString = typeof spec === 'string' || spec instanceof DOMSpec;
		[ spec = [], callback = undefined, params = {} ] = this.resolveArgs( arguments );
		const { context } = this;
		// -------------
		const records = attrIntersection( context, spec );
		if ( !callback ) return records;
		const signalGenerator = params.lifecycleSignals && this.createSignalGenerator();
		if ( !originalFilterIsString ) {
			const flags = signalGenerator?.generate() || {};
			callback( records, flags, context );
		} else {
			for ( const record of records ) {
				const flags = signalGenerator ? signalGenerator.generate() : {};
				callback( record, flags, context );
			}
		}
		// -------------
		if ( params.live ) {
			if ( signalGenerator ) { params = { ...params, signalGenerator }; }
			const disconnectable_live = this.observe( originalFilterIsString ? spec[ 0 ] : spec, callback, { newValue: true, ...params } );
			return this.disconnectables( params.signal, disconnectable_live );
		}
	}

	/**
	 * Mutation Observer
	 * 
	 * @param array|string				spec
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observe( spec, callback, params = {} ) {
		const originalFilterIsString = typeof spec === 'string' || spec instanceof DOMSpec;
		[ spec = [], callback, params = {} ] = this.resolveArgs( arguments );
		// ------------------------
		if ( [ 'sync', 'intercept' ].includes( params.timing ) ) return this.observeSync( originalFilterIsString ? spec[ 0 ] : spec, callback, params );
		if ( params.timing && params.timing !== 'async' ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		// ------------------------
		const { context, window, webqit } = this;
		// ------------------
		if ( params.eventDetails && !webqit.realdom.attrInterceptionHooks?.intercepting ) {
			attrInterception.call( window, 'intercept', () => {} );
		}
		// -------------
		const disconnectable = new window.MutationObserver( records => {
			records = dedupAndIgnoreInternals( records ).map( rcd => withAttrEventDetails.call( window, rcd ) );
			dispatch.call( window, registration, records, context );
		} );
		// ------------------
		const $params = { attributes: true, attributeOldValue: params.oldValue, subtree: params.subtree && true };
		if ( spec.length ) { $params.attributeFilter = spec.map( a => a + '' ); }
		disconnectable.observe( context, $params );
		// -------------
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, spec, callback, params, atomics: new Map, originalFilterIsString, signalGenerator, disconnectable };
		// -------------
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}
	
	/**
	 * Mutation Interceptor
	 * 
	 * @param array|string				spec
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observeSync( spec, callback, params = {} ) {
		const originalFilterIsString = typeof spec === 'string' || spec instanceof DOMSpec;
		[ spec, callback, params = {} ] = this.resolveArgs( arguments );
		const { context, window } = this;
		// -------------
		if ( params.timing && ![ 'sync', 'intercept' ].includes( params.timing ) ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		const interceptionTiming = params.timing === 'intercept' ? 'intercept' : 'sync';
		if ( !this.registry( interceptionTiming ).size ) {
			// One handler per intercept/sync registry
			attrInterception.call( window, interceptionTiming, records => {
				this.forEachMatchingContext( interceptionTiming, records, dispatch );
			} );
		}
		// -------------
		const disconnectable = { disconnect() { registry.delete( registration ); } };
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, spec, callback, params, atomics: new Map, originalFilterIsString, signalGenerator, disconnectable };
		const registry = this.registry( interceptionTiming );
		registry.set( registration, !!registration.params.deferred );
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
function dedupAndIgnoreInternals( records ) {
	return records.reduce( ( rcds, rcd, i ) => {
		if ( rcds[ i - 1 ]?.attributeName === rcd.attributeName ) return rcds;
		if ( _internals( rcd.target, 'internalAttrInteractions' ).get( rcd.attributeName ) ) return rcds;
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
	const { context, spec, callback, params, atomics, originalFilterIsString, signalGenerator } = registration;
	if (!params.subtree) {
		records = records.filter((r) => {
			return r.target === context;
		}); 
	}
	if ( !records.length ) return;
	const $spec = spec.map( a => a + '' );
	if ( params.atomic && !atomics.size ) {
		records = attrIntersection( context, spec, records );
	} else if ( params.timing !== 'async' && spec.length ) {
		records = records.filter( r => $spec.includes( r.name ) );
	}
	if ( !records.length ) return;
	// Should we care about old / new values being present?
	if ( !( params.newValue === null && params.oldValue === null && params.eventDetails ) ) {
		records = records.map( rcd => {
			let exclusion;
			if ( !params.eventDetails ) {
				( { event: exclusion, ...rcd } = rcd );
			}
			if ( !params.oldValue && ( 'oldValue' in rcd ) ) {
				( { oldValue: exclusion, ...rcd } = rcd );
			}
			if ( !params.newValue && ( 'value' in rcd ) ) {
				( { value: exclusion, ...rcd } = rcd );
			} else if ( params.newValue && typeof rcd.value === 'undefined' ) {
				rcd = {  ...rcd, value: internalAttrInteraction( rcd.target, rcd.name, () => rcd.target.getAttribute( rcd.name ) ) };
			}
			return rcd;
		} );
	}
	if ( params.atomic ) {
		records.forEach( record => atomics.set( record.name, record ) );
		records = Array.from( atomics.entries() ).map( ( [ , value ] ) => value );
	}
	const record_s = originalFilterIsString ? records[ 0 ] : records;
	const flags = signalGenerator ? signalGenerator.generate() : {};
	callback( record_s, flags, context );
}

/**
 */
function internalAttrInteraction( node, attrName, callback ) {
	const savedAttrLocking = _internals( node, 'internalAttrInteractions' ).get( attrName );
	_internals( node, 'internalAttrInteractions' ).set( attrName, true );
	const value = callback();
	_internals( node, 'internalAttrInteractions' ).set( attrName, savedAttrLocking );
	return value;
}

/**
 * Helper to determining which records to deliver.
 * 
 * @param Object 			context
 * @param Array 			spec
 * @param Array 			records
 * 
 * @returns Array
 */
function attrIntersection( context, spec, records = [] ) {
	const _type = { event: null, type: 'attribute' };
	if ( spec.length ) {
		return spec.map( attrName => {
			attrName = attrName + '';
			return records.find( r => r.name === attrName ) || { target: context, name: attrName, value: internalAttrInteraction( context, attrName, () => context.getAttribute( attrName ) ), ..._type };
		} );
	}
	const attrs = Array.from( context.attributes );
	return attrs.map( attr => {
		return records.find( r => r.name === attr.nodeName ) || { target: context, name: attr.nodeName, value: internalAttrInteraction( context, attr.nodeName, () => attr.nodeValue ), ..._type };
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
	const window = this, registry = window.webqit.realdom.attrInterceptionRecords?.get( target ) || {};
	const event = registry[ attributeName ]?.[ 0 ] || 'mutation';
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
	const { webqit, document, Element } = window;
	if ( !webqit.realdom.attrInterceptionHooks ) { Object.defineProperty( webqit.realdom, 'attrInterceptionHooks', { value: new Map } ); }
	if ( !webqit.realdom.attrInterceptionHooks.has( timing ) ) { webqit.realdom.attrInterceptionHooks.set( timing, new Set ); }
	webqit.realdom.attrInterceptionHooks.get( timing ).add( callback );
	const rm = () => webqit.realdom.attrInterceptionHooks.get( timing ).delete( callback );
	if ( webqit.realdom.attrInterceptionHooks?.intercepting ) return rm;
	console.warn( `Attr mutation APIs are now being intercepted.` );
	webqit.realdom.attrInterceptionHooks.intercepting = true;
	Object.defineProperty( webqit.realdom, 'attrInterceptionRecords', { value: new Map } );

	// Interception hooks
	const attrIntercept = ( record, defaultAction ) => {
		if ( !webqit.realdom.attrInterceptionRecords.has( record.target ) ) { webqit.realdom.attrInterceptionRecords.set( record.target, {} ); }
		const registry = webqit.realdom.attrInterceptionRecords.get( record.target );
		// ------------------
		registry[ record.name ] = registry[ record.name ] || [];
		registry[ record.name ].unshift( record.event );
		if ( _internals( record.target, 'internalAttrInteractions' ).get( record.name ) ) return defaultAction();
		// ------------------
		webqit.realdom.attrInterceptionHooks.get( 'intercept' )?.forEach( callback => callback( [ record ] ) );
		const returnValue = defaultAction();
		webqit.realdom.attrInterceptionHooks.get( 'sync' )?.forEach( callback => callback( [ record ] ) );
		return returnValue;
	};

	// Interception observer WILL need to know non-API-based mutations
	const mo = new window.MutationObserver( records => {
		records = records.filter( rcd => {
			const registry = window.webqit.realdom.attrInterceptionRecords?.get( rcd.target ) || {};
			return !registry[ rcd.attributeName ]?.shift();
		} );
		records = dedupAndIgnoreInternals( records ).map( rcd => withAttrEventDetails.call( window, rcd ) );
		if ( !records.length ) return;
		webqit.realdom.attrInterceptionHooks.get( 'intercept' )?.forEach( callback => callback( records ) );
		webqit.realdom.attrInterceptionHooks.get( 'sync' )?.forEach( callback => callback( records ) );
	} );
	mo.observe( document, { attributes: true, subtree: true, attributeOldValue: true } );

	// Intercept DOM attr mutation methods
	const originalApis = Object.create( null );
	[ 'setAttribute', 'removeAttribute', 'toggleAttribute', ].forEach( apiName => {
		originalApis[ apiName ] = Element.prototype[ apiName ];
		Element.prototype[ apiName ] = function( ...args ) {
			let value, oldValue = internalAttrInteraction( this, args[ 0 ], () => this.getAttribute( args[ 0 ] ) );
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
