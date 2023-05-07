
/**
 * @imports
 */
import { _isObject } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import AttrRealtime from './AttrRealtime.js';
import Realtime from './Realtime.js';

/**
 *
 * @class DOMRealtime
 */
export default class DOMRealtime extends Realtime {

	/**
	 * @constructor
	 */
	constructor( context, ...args ) {
		super( context, 'tree', ...args );
	}

	/**
	 * Alias for ( new AttrRealtime() ).all( ... )
	 */
	attr( filter, callback = undefined, params = {} ) {
		const { context, window } = this;
		return ( new AttrRealtime( context, window ) ).get( ...arguments );
	}

	/**
	 * Runs a query.
	 *
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Disconnectable|Void
	 */
	query( selectors, callback = undefined, params = {} ) {
		[ selectors, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		const { context } = this;
		// ------------------
		const records = new Map, getRecord = target => {
			if ( !records.has( target ) ) { records.set( target, { target, entrants: [], exits: [], type: 'query', event: null } ); }
			return records.get( target );
		};
		// ------------------
		if ( !params.generation || params.generation === 'entrants' ) {
			if ( !selectors.length ) {
				//if ( params.subtree ) throw new Error( `The subtree option requires a selector to work.` );
				[ ...context.children ].forEach( node => getRecord( context ).entrants.push( node ) );
			} else if ( selectors.every( selector => typeof selector === 'string' ) && ( selectors = selectors.join( ',' ) ) ) {
				const matches = params.subtree
					? context.querySelectorAll( selectors )
					: [ ...context.children ].filter( node => node.matches( selectors ) );
				matches.forEach( node => getRecord( node.parentNode || context ).entrants.push( node ) );
			}
		}
		// ------------------
		if ( !callback ) return records;
		const disconnectable = { disconnected: false };
		const signalGenerator = callback && params.lifecycleSignals && this.createSignalGenerator();
		for ( const [ , record ] of records ) {
			if ( disconnectable.disconnected ) break;
			const flags = signalGenerator?.generate() || {};
			callback( record, flags, context );
		}
		// ------------------
		if ( params.live ) {
			if ( signalGenerator ) { params = { ...params, signalGenerator }; }
			const disconnectable_live = this.observe( selectors, callback, params );
			return this.disconnectables( params.signal, disconnectable, disconnectable_live );
		}
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}

	/**
	 * Alias for query( ..., { subtree: false } )
	 */
	children( selectors, callback = undefined, params = {} ) {
		[ selectors, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		return this.query( selectors, callback, { ...params, subtree: false } );
	}

	/**
	 * Alias for query( ..., { subtree: true } )
	 */
	subtree( selectors, callback = undefined, params = {} ) {
		[ selectors, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		return this.query( selectors, callback, { ...params, subtree: true } );
	}

	/**
	 * Mutation Observer
	 * 
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observe( selectors, callback, params = {} ) {
		[ selectors, callback, params = {} ] = this.resolveArgs( arguments );
		// ------------------------
		if ( [ 'sync', 'intercept' ].includes( params.timing ) ) return this.observeSync( selectors, callback, params );
		if ( params.timing && params.timing !== 'async' ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		// ------------------------
		const { context, window, webqit, document } = this;
		// ------------------
		if ( params.eventDetails ) { webqit.realdom.domInterceptionRecordsAlwaysOn = true; }
		if ( ( document.readyState === 'loading' || webqit.realdom.domInterceptionRecordsAlwaysOn ) && !webqit.realdom.domInterceptionHooks?.intercepting ) {
			domInterception.call( window, 'sync', () => {} );
		}
		// -------------
		const disconnectable = new window.MutationObserver( records => records.forEach( record => {
			dispatch.call( window, registration, withEventDetails.call( window, record ), context );
		} ) );
		disconnectable.observe( context, { childList: true, subtree: params.subtree, } );
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, selectors, callback, params, signalGenerator, disconnectable };
		// -------------
		if ( params.staticSensitivity ) {
			const disconnectable_attr = staticSensitivity.call( window, registration );
			return this.disconnectables( params.signal, disconnectable, signalGenerator, disconnectable_attr );
		}
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}
	
	/**
	 * Mutation Interceptor
	 * 
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observeSync( selectors, callback, params = {} ) {
		[ selectors, callback, params = {} ] = this.resolveArgs( arguments );
		const { context, window } = this;
		// -------------
		if ( params.timing && ![ 'sync', 'intercept' ].includes( params.timing ) ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		const interceptionTiming = params.timing === 'intercept' ? 'intercept' : 'sync';
		const intersectionDepth = params.subtree ? 'subtree' : 'children';
		if ( !this.registry( interceptionTiming ).size ) {
			// One handler per intercept/sync registry
			domInterception.call( window, interceptionTiming, record => {
				this.forEachMatchingContext( interceptionTiming, record, dispatch );
			} );
		}
		const mo = new window.MutationObserver( records => records.forEach( record => {
			if ( Array.isArray( ( record = withEventDetails.call( window, record ) ).event ) ) return;
			dispatch.call( window, registration, record, context );
		} ) );
		mo.observe( context, { childList: true, subtree: params.subtree } );
		// -------------
		const disconnectable = { disconnect() {
			mo.disconnect();
			registry.delete( registration );
			if ( !registry.size ) { registries.delete( context ); }
		} };
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, selectors, callback, params, signalGenerator, disconnectable };
		// -------------
		const registries = this.registry( interceptionTiming, intersectionDepth );
		if ( !registries.has( context ) ) { registries.set( context, new Set ); }
		const registry = registries.get( context );
		registry.add( registration );
		// -------------
		if ( params.staticSensitivity ) {
			const disconnectable_attr = staticSensitivity.call( window, registration );
			return this.disconnectables( params.signal, disconnectable, signalGenerator, disconnectable_attr );
		}
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}
}

/**
 * Sensitivty for attribute changes for attribute selectors.
 * 
 * @param object registration
 * 
 * @returns Disconnectable
 */
function staticSensitivity( registration ) {
	const window = this;
	const { context, selectors, callback, params, signalGenerator } = registration;
	const parseDot = selector => selector.match( /\.([\w-]+)/g )?.length ? [ 'class' ] : [];
	const parseHash = selector => selector.match( /#([\w-]+)/g )?.length ? [ 'id' ] : [];
	const parse = selector => [ ...selector.matchAll(/\[([^\=\]]+)(\=[^\]]+)?\]/g) ].map( x => x[ 1 ] ).concat( parseDot( selector ) ).concat( parseHash( selector ) );
	if ( !( registration.$attrs = Array.from( new Set( selectors.filter( s => typeof s === 'string' && s.includes( '[' ) ).reduce( ( attrs, selector ) => attrs.concat( parse( selector ) ), [] ) ) ) ).length ) return;
	// ---------
	const entrants = new Set, exits = new Set;
	entrants.push = val => ( exits.delete( val ), entrants.add( val ) );
	exits.push = val => ( entrants.delete( val ), exits.add( val ) );
	registration.$deliveryCache = { entrants, exits };
	// ---------
	return ( new AttrRealtime( context, window ) ).observe( registration.$attrs, _records => {
		const records = new Map, getRecord = target => {
			if ( !records.has( target ) ) { records.set( target, { target, entrants: [], exits: [], type: 'static', event: null } ); }
			return records.get( target );
		};
		// ---------
		const matchesCache = new WeakMap;
		const matches = node => {
			if ( !matchesCache.has( node ) ) { matchesCache.set( node, selectors.some( selector => node.matches( selector ) ) ); }
			return matchesCache.get( node );
		};
		// ---------
		for ( const _record of _records ) {
			[ 'entrants', 'exits' ].forEach( generation => {
				if ( params.generation && generation !== params.generation ) return;
				if ( registration.$deliveryCache[ generation ].has( _record.target ) || ( generation === 'entrants' ? !matches( _record.target ) : matches( _record.target ) ) ) return;
				registration.$deliveryCache[ generation ].push( _record.target );
				getRecord( _record.target )[ generation ].push( _record.target );
				getRecord( _record.target ).event = _record.event;
			} );
		}
		// ---------
		for ( const [ , record ] of records ) {
			const flags = signalGenerator?.generate() || {};
			callback( record, flags, context );
		}
	}, { subtree: params.subtree, timing: params.timing, eventDetails: params.eventDetails } );
}

/**
 * Dispatches a mutation record if it matches the observed.
 * 
 * @param Object 			registration 
 * @param Object 			record 
 * 
 * @returns Void
 */
function dispatch( registration, _record ) {
	const { context, selectors, callback, params, signalGenerator, $deliveryCache } = registration;
	// ---------
	const record = { ..._record, entrants: [], exits: [] };
	if ( !params.eventDetails ) { delete record.event; }
	[ 'entrants', 'exits' ].forEach( generation => {
		if ( params.generation && generation !== params.generation ) return;
		if ( selectors.length ) {
			record[ generation ] = nodesIntersection( selectors, _record[ generation ], _record.event !== 'parse' );
		} else {
			record[ generation ] = [ ..._record[ generation ] ];
		}
		if ( !$deliveryCache ) return;
		for ( const node of record[ generation ] ) {
			$deliveryCache[ generation ].push( node );
		}
	} );
	// ---------
	if ( !record.entrants.length && !record.exits.length ) return;
	const flags = signalGenerator?.generate() || {};
	callback( record, flags, context );
}

/**
 * Aggregates instances of els in sources
 * 
 * @param Array 			targets 
 * @param Array 			sources 
 * @param Bool 				deepIntersect 
 * 
 * @returns 
 */
function nodesIntersection( targets, sources, deepIntersect ) {
	sources = Array.isArray( sources ) ? sources : [ ...sources ];
	const match = ( sources, target ) => {
		// Filter out text nodes
		sources = sources.filter( source => source.matches );
		if ( typeof target === 'string' ) {
			// Is directly mutated...
			let matches = sources.filter( source => source.matches( target ) );
			// Is contextly mutated...
			if ( deepIntersect ) {
				matches = sources.reduce( ( collection, source ) => {
					return [ ...collection, ...source.querySelectorAll( target ) ];
				}, matches );
			}
			if ( matches.length ) return matches;
		} else {
			// Is directly mutated...
			if ( sources.includes( target ) || (
				deepIntersect && sources.some( source => source.contains( target ) )
			) ) { return [ target ]; }
		}
	};
	// Search can be expensive...
	// Multiple listeners searching the same thing in the same list?
	if ( !sources.$$searchCache ) { sources.$$searchCache = new Map; }
	return targets.reduce( ( matches, target ) => {
		let _matches;
		if ( sources.$$searchCache.has( target ) ) {
			_matches = sources.$$searchCache.get( target );
		} else {
			_matches = match( sources, target ) || [];
			if ( _isObject( target ) ) {
				sources.$$searchCache.set( target, _matches );
			}
		}
		return matches.concat( _matches );
	}, [] );
}

/**
 * Determines the event for a mutation record
 * 
 * @param MutationRecord 	{ target, entrants, exits }
 * 
 * @returns Object
 */
function withEventDetails( { target, addedNodes, removedNodes } ) {
	let window = this, event;
	event = _arrFrom( addedNodes ).reduce( ( prev, node ) => prev || window.webqit.realdom.domInterceptionRecords?.get( node ), null );
	event = _arrFrom( removedNodes ).reduce( ( prev, node ) => prev || window.webqit.realdom.domInterceptionRecords?.get( node ), event );
	event = event || window.document.readyState === 'loading' && 'parse' || 'mutation';
	return { target, entrants: addedNodes, exits: removedNodes, type: 'observation', event };
}

/**
 * DOM intersection engine.
 * 
 * @param String 			timing 
 * @param Function 			callback 
 * 
 * @returns 
 */
function domInterception( timing, callback ) {
	const window = this;
	const { webqit, document, Node, CharacterData, Element, HTMLElement, HTMLTemplateElement, DocumentFragment } = window;
	if ( !webqit.realdom.domInterceptionHooks ) { Object.defineProperty( webqit.realdom, 'domInterceptionHooks', { value: new Map } ); }
	if ( !webqit.realdom.domInterceptionHooks.has( timing ) ) { webqit.realdom.domInterceptionHooks.set( timing, new Set ); }
	webqit.realdom.domInterceptionHooks.get( timing ).add( callback );
	const rm = () => webqit.realdom.domInterceptionHooks.get( timing ).delete( callback );
	if ( webqit.realdom.domInterceptionHooks?.intercepting ) return rm;
	console.warn( `DOM mutation APIs are now being intercepted.` );
	webqit.realdom.domInterceptionHooks.intercepting = true;
	Object.defineProperty( webqit.realdom, 'domInterceptionRecords', { value: new Map } );

	// Interception hooks
	const intercept = ( record, defaultAction ) => {
		record.entrants.concat( record.exits ).forEach( node => {
			clearTimeout( webqit.realdom.domInterceptionRecords.get( node )?.timeout ); // Clear any previous that's still active
			webqit.realdom.domInterceptionRecords.set( node, record.event ); // Main: set event details... and next to timeout details
			const timeout = setTimeout( () => { webqit.realdom.domInterceptionRecords.delete( node ); }, 0 );
			Object.defineProperty( record.event, 'timeout', { value: timeout, configurable: true } );
		} );
		webqit.realdom.domInterceptionHooks.get( 'intercept' )?.forEach( callback => callback( record ) );
		const returnValue = defaultAction();
		webqit.realdom.domInterceptionHooks.get( 'sync' )?.forEach( callback => callback( record ) );
		return returnValue;
	};

	// Intercept DOM mutation methods
	const _originalApis = { characterData: Object.create( null ), other: Object.create( null ) };
	[ 'insertBefore'/*Node*/, 'insertAdjacentElement', 'insertAdjacentHTML', 'setHTML',
		'replaceChildren', 'replaceWith', 'remove', 'replaceChild'/*Node*/, 'removeChild'/*Node*/, 
		'before', 'after', 'append', 'prepend', 'appendChild'/*Node*/, 
	].forEach( apiName => {
		function method( ...args ) {
			const originalApis = this instanceof CharacterData ? _originalApis.characterData : _originalApis.other;
			// Instance of Node interface? Abort!
			const exec = () => originalApis[ apiName ].call( this, ...args );
			if ( !( this instanceof CharacterData || this instanceof Element || this instanceof DocumentFragment ) ) return exec();
			// --------------
			// Obtain exits and entrants
			let exits = [], entrants = [], target = this;
			if ( [ 'insertBefore' ].includes( apiName ) ) {
				entrants = [ args[ 0 ] ];
			} else if ( [ 'insertAdjacentElement', 'insertAdjacentHTML' ].includes( apiName ) ) {
				entrants = [ args[ 1 ] ];
				if ( [ 'beforebegin', 'afterend' ].includes( args[ 0 ] ) ) {
					target = this.parentNode;
				}
			} else if ( [ 'setHTML', 'replaceChildren' ].includes( apiName ) ) {
				exits = [ ...this.childNodes ];
				entrants = apiName === 'replaceChildren' ? [ ...args ] : [ args[ 0 ] ];
			} else if ( [ 'replaceWith', 'remove' ].includes( apiName ) ) {
				exits = [ this ];
				entrants = apiName === 'replaceWith' ? [ ...args ] : [];
				target = this.parentNode;
			} else if ( [ 'replaceChild' ].includes( apiName ) ) {
				exits = [ args[ 1 ] ];
				entrants = [ args[ 0 ] ];
			} else if ( [ 'removeChild' ].includes( apiName ) ) {
				exits = [ ...args ];
			} else {
				// 'before', 'after', 'append', 'prepend', 'appendChild'
				entrants = [ ...args ];
				if ( [ 'before', 'after' ].includes( apiName ) ) {
					target = this.parentNode;
				}
			}
			// --------------
			// Parse HTML to entrants
			let apiNameFinal = apiName;
			if ( [ 'insertAdjacentHTML', 'setHTML' ].includes( apiName ) ) {
				let tempNodeName = this.nodeName;
				if ( apiName === 'insertAdjacentHTML' && [ 'beforebegin', 'afterend' ].includes( args[ 0 ] ) ) {
					// We can't handle this... and this is going to throw afterall
					if ( !this.parentNode ) return originalApis[ apiName ].call( this, ...args );
					tempNodeName = this.parentNode.nodeName;
				}
				const temp = document.createElement( tempNodeName );
				originalApis.setHTML.call( temp, entrants[ 0 ], apiName === 'setHTML' ? args[ 1 ] : {} );
				entrants = [ ...temp.childNodes ];
				// --------------  
				if ( apiName === 'insertAdjacentHTML' ) {
					apiNameFinal = 'insertAdjacentElement';
					args[ 1 ] = new DocumentFragment;
					args[ 1 ].______isTemp = true;
					args[ 1 ].append( ...temp.childNodes );
				} else {
					apiNameFinal = 'replaceChildren';
					args = [ ...temp.childNodes ];
				}
			}
			// --------------
			const record = { target, entrants, exits, type: 'interception', event: [ this, apiName ] };
			return intercept( record, () => {
				return originalApis[ apiNameFinal ].call( this, ...args );
			} );
		}
		// We'll be sure to monkey the correct interface
		if ( [ 'insertBefore', 'replaceChild', 'removeChild', 'appendChild' ].includes( apiName ) ) {
			_originalApis.other[ apiName ] = Node.prototype[ apiName ];
			Node.prototype[ apiName ] = method;
		} else {
			// Comment nodes have this methods too
			if ( [ 'after', 'before', 'remove', 'replaceWith' ].includes( apiName ) ) {
				_originalApis.characterData[ apiName ] = CharacterData.prototype[ apiName ];
				CharacterData.prototype[ apiName ] = method;
			}
			// In case newer methods like setHTML() are not supported
			if ( Element.prototype[ apiName ] ) {
				_originalApis.other[ apiName ] = Element.prototype[ apiName ];
				Element.prototype[ apiName ] = method;
			}
		}
	} );

	const originalApis = Object.create( null );
	// Intercept DOM mutation properties
	[ 'outerHTML', 'outerText'/*HTMLElement*/, 'innerHTML', 
		'innerText'/*HTMLElement*/,'textContent'/*Node*/, 'nodeValue'/*Node*/
	].forEach( apiName => {
		// We'll be sure to monkey the correct interface
		const Interface = [ 'textContent', 'nodeValue' ].includes( apiName ) ? Node : (
			[ 'outerText', 'innerText' ].includes( apiName ) ? HTMLElement : Element
		);
		originalApis[ apiName ] = Object.getOwnPropertyDescriptor( Interface.prototype, apiName );
		Object.defineProperty( Interface.prototype, apiName, { ...originalApis[ apiName ], set: function( value ) {
			let exec = () => originalApis[ apiName ].set.call( this, value );
			// Instance of Node interface? Abort!
			if ( !( this instanceof Element ) ) return exec();
			// --------------
			// Obtain exits and entrants
			let exits = [], entrants = [], target = this;
			if ( [ 'outerHTML', 'outerText' ].includes( apiName ) ) {
				exits = [ this ];
				target = this.parentNode;
			} else {
				// 'innerHTML', 'innerText', 'textContent', 'nodeValue'
				exits = /*this instanceof HTMLTemplateElement 
					? [ ...this.content.childNodes ]
					: */[ ...this.childNodes ];
			}
			// --------------
			// Parse HTML to nodes
			if ( [ 'outerHTML', 'innerHTML' ].includes( apiName ) ) {
				let tempNodeName = this.nodeName;
				if ( apiName === 'outerHTML' ) {
					// We can't handle this... and this is going to throw afterall
					if ( !this.parentNode ) return exec();
					tempNodeName = this.parentNode.nodeName;
				}
				const temp = document.createElement( tempNodeName === 'TEMPLATE' ? 'div' : tempNodeName );
				originalApis[ apiName ].set.call( temp, value );
				entrants = /*[ ...temp.childNodes ];*/this instanceof HTMLTemplateElement ? [] : [ ...temp.childNodes ];
				// -------------- 
				if ( apiName === 'outerHTML' ) {
					value = new DocumentFragment;
					value.______isTemp = true;
					value.append( ...temp.childNodes );
					exec = () => originalApis.replaceWith.call( this, value );
				} else {
					if ( this instanceof HTMLTemplateElement ) {
						exec = () => this.content.replaceChildren( ...temp.childNodes );
					} else {
						exec = () => originalApis.replaceChildren.call( this, ...temp.childNodes );
					}
				}
			}
			// -------------- 
			const record = { target, entrants, exits, type: 'interception', event: [ this, apiName ] };
			return intercept( record, exec );
		} } );
	} );

	// Intercept document mutation methods
	[ 'append', 'prepend', 'replaceChildren' ].forEach( apiName => {
		[ document, DocumentFragment.prototype ].forEach( target => {
			const originalApi = target[ apiName ];
			target[ apiName ] = function( ...args ) {
				if ( this.______isTemp ) return originalApi.call( this, ...args );
				const exits = apiName === 'replaceChildren' ? [ ...this.childNodes ] : [];
				const record = {
					target: this,
					entrants: args,
					exits,
					type: 'interception', 
					event: [ this, apiName ]
				};
				return intercept( record, () => {
					return originalApi.call( this, ...args );
				} );
			}
		} );
	} );

	return rm;
}
