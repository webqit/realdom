
/**
 * @imports
 */
import { _isObject } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import AttrRealtime from './AttrRealtime.js';
import Realtime from './Realtime.js';
import * as Util from './Util.js';

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
	 * @param array|Element|string		spec
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Disconnectable|Void
	 */
	query( spec, callback = undefined, params = {} ) {
		[ spec, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		const { context } = this;
		// ------------------
		const records = new Map, getRecord = target => {
			if ( !records.has( target ) ) { records.set( target, { target, entrants: [], exits: [], type: 'query', event: null } ); }
			return records.get( target );
		};
		// ------------------
		if ( !params.generation || params.generation === 'entrants' ) {
			if ( !spec.length ) {
				//if ( params.subtree ) throw new Error( `The subtree option requires a selector to work.` );
				[ ...context.children ].forEach( node => getRecord( context ).entrants.push( node ) );
			} else if ( spec.every( s => s.type === 'selector' ) ) {
				const [ cssSelectors, xpathQueries ] = spec.reduce( ( [ css, xpath ], s ) => {
					return s.kind === 'xpath' ? [ css, xpath.concat( s ) ] : [ css.concat( s ), xpath ];
				}, [ [], [] ] );
				const matches = [];
				if ( params.subtree ) {
					if ( cssSelectors.length ) { matches.push( ...context.querySelectorAll( cssSelectors.join( ',' ) ) ); }
					if ( xpathQueries.length ) { matches.push( ...Util.xpathQuery( this.window, context, xpathQueries ) ); }
				} else {
					if ( cssSelectors.length ) { matches.push( ...[ ...context.children ].filter( node => node.matches( cssSelectors ) ) ); }
					if ( xpathQueries.length ) { matches.push( ...Util.xpathQuery( this.window, context, xpathQueries, false ) ); }
				}
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
			const disconnectable_live = this.observe( spec, callback, params );
			return this.disconnectables( params.signal, disconnectable, disconnectable_live );
		}
		return this.disconnectables( params.signal, disconnectable, signalGenerator );
	}

	/**
	 * Alias for query( ..., { subtree: false } )
	 */
	children( spec, callback = undefined, params = {} ) {
		[ spec, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		return this.query( spec, callback, { ...params, subtree: false } );
	}

	/**
	 * Alias for query( ..., { subtree: true } )
	 */
	subtree( spec, callback = undefined, params = {} ) {
		[ spec, callback = undefined, params = {} ] = this.resolveArgs( arguments );
		return this.query( spec, callback, { ...params, subtree: true } );
	}

	/**
	 * Mutation Observer
	 * 
	 * @param array|Element|string		spec
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observe( spec, callback, params = {} ) {
		[ spec, callback, params = {} ] = this.resolveArgs( arguments );
		// ------------------------
		if ( [ 'sync', 'intercept' ].includes( params.timing ) ) return this.observeSync( spec, callback, params );
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
		disconnectable.observe( context, { childList: true, subtree: params.subtree && true, } );
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, spec, callback, params, signalGenerator, disconnectable };
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
	 * @param array|Element|string		spec
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Disconnectable
	 */
	observeSync( spec, callback, params = {} ) {
		[ spec, callback, params = {} ] = this.resolveArgs( arguments );
		const { context, window } = this;		
		// -------------
		if ( params.timing && ![ 'sync', 'intercept' ].includes( params.timing ) ) throw new Error( `Timing option "${ params.timing }" invalid.` );
		const interceptionTiming = params.timing === 'intercept' ? 'intercept' : 'sync';
		const intersectionDepth = params.subtree === 'cross-roots' ? 'cross-roots' : ( params.subtree ? 'subtree' : 'children' );
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
		mo.observe( context, { childList: true, subtree: params.subtree && true } );
		// -------------
		const disconnectable = { disconnect() {
			mo.disconnect();
			registry.delete( registration );
			if ( !registry.size ) { registries.delete( context ); }
		} };
		const signalGenerator = params.signalGenerator || params.lifecycleSignals && this.createSignalGenerator();
		const registration = { context, spec, callback, params, signalGenerator, disconnectable };
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

	/**
	 * Tracks the connectedness of element references.
	 *
	 * @param array|Element				elements
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Disconnectable
	 */
	track( elements, callback, params = {} ) {
		params = { subtree: true, ...params };
		return this.observe( elements, record => {
			if ( record.entrants.length ) callback( true, Array.isArray( elements ) ? record.entrants : record.entrants[ 0 ] );
			if ( record.exits.length ) callback( false, Array.isArray( elements ) ? record.exits : record.exits[ 0 ] );
		}, params );
	}
}

/**
 * Sensitivty for attribute changes for attribute spec.
 * 
 * @param object registration
 * 
 * @returns Disconnectable
 */
function staticSensitivity( registration ) {
	const window = this;
	const { context, spec, callback, params, signalGenerator } = registration;
	const cssSelectors = spec.filter( s => s.kind === 'css' );
	const parseDot = selector => selector.match( /\.([\w-]+)/g )?.length ? [ 'class' ] : [];
	const parseHash = selector => selector.match( /#([\w-]+)/g )?.length ? [ 'id' ] : [];
	const parse = selector => [ ...selector.matchAll( /\[([^\=\]]+)(\=[^\]]+)?\]/g ) ].map( x => x[ 1 ] ).concat( parseDot( selector ) ).concat( parseHash( selector ) );
	if ( !( registration.$attrs = Array.from( new Set( cssSelectors.filter( s => ( s + '' ).includes( '[' ) ).reduce( ( attrs, selector ) => attrs.concat( parse( selector + '' ) ), [] ) ) ) ).length ) return;
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
			if ( !matchesCache.has( node ) ) { matchesCache.set( node, cssSelectors.some( s => node.matches( s + '' ) ) ); }
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
	const { context, spec, callback, params, signalGenerator, $deliveryCache } = registration;
	// ---------
	const record = { ..._record, entrants: [], exits: [] };
	if ( !params.eventDetails ) { delete record.event; }
	[ 'entrants', 'exits' ].forEach( generation => {
		if ( params.generation && generation !== params.generation ) return;
		if ( spec.length ) {
			record[ generation ] = nodesIntersection.call( this, spec, params.subtree === 'cross-roots', _record[ generation ], _record.event !== 'parse' );
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
 * @param Array 			spec 
 * @param Bool 				crossRoots 
 * @param Array 			sources 
 * @param Bool 				deepIntersect 
 * 
 * @returns 
 */
function nodesIntersection( spec, crossRoots, sources, deepIntersect ) {
	sources = Array.isArray( sources ) ? sources : [ ...sources ];
	const match = ( sources, s ) => {
		// Filter out text nodes
		if ( s.type === 'selector' ) {
			// Is directly mutated...
			let matches = s.isXpathAttr ? [] : sources.filter( source => s.kind === 'xpath' ? Util.xpathMatch( this, source, s + '' ) : source.matches && source.matches( s + '' ) );
			// Is contextly mutated...
			if ( deepIntersect || s.isXpathAttr ) {
				matches = sources.reduce( ( collection, source ) => {
					if ( s.kind === 'xpath' ) { return [ ...collection, ...Util.xpathQuery( this, source, s, deepIntersect ) ]; }
					return source.querySelectorAll ? [ ...collection, ...source.querySelectorAll( s + '' ) ] : collection;
				}, matches );
			}
			if ( matches.length ) return matches;
		} else {
			// Is directly mutated...
			if ( sources.includes( s.content ) || (
				deepIntersect && sources.some( source => Util.containsNode( this/* window */, source, s.content, crossRoots ) )
			) ) { return [ s.content ]; }
		}
	};
	// Search can be expensive...
	// Multiple listeners searching the same thing in the same list?
	if ( !sources.$$searchCache ) { sources.$$searchCache = new Map; }
	return spec.reduce( ( matches, s ) => {
		let _matches;
		if ( sources.$$searchCache.has( s.content ) ) {
			_matches = sources.$$searchCache.get( s.content );
		} else {
			_matches = match( sources, s ) || [];
			if ( s.type === 'instance' ) {
				sources.$$searchCache.set( s.content, _matches );
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
	if ( !webqit.realdom.domInterceptionNoRecurse ) { Object.defineProperty( webqit.realdom, 'domInterceptionNoRecurse', { value: new Map } ); }
	if ( !webqit.realdom.domInterceptionHooks.has( timing ) ) { webqit.realdom.domInterceptionHooks.set( timing, new Set ); }
	webqit.realdom.domInterceptionHooks.get( timing ).add( callback );
	const rm = () => webqit.realdom.domInterceptionHooks.get( timing ).delete( callback );
	if ( webqit.realdom.domInterceptionHooks?.intercepting ) return rm;
	console.warn( `DOM mutation APIs are now being intercepted.` );
	webqit.realdom.domInterceptionHooks.intercepting = true;
	Object.defineProperty( webqit.realdom, 'domInterceptionRecords', { value: new Map } );

	// No recursion helper
	const noRecurse = ( node, method, callback ) => {
		webqit.realdom.domInterceptionNoRecurse.set( node, method );
		const returnValue = callback();
		webqit.realdom.domInterceptionNoRecurse.delete( node );
		return returnValue;
	};

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
	const _apiNames = {
		// Note the order
		ShadowRoot: [ 'innerHTML' ],
		DocumentFragment: [ 'replaceChildren', 'append', 'prepend' ],
		Document: [ 'replaceChildren', 'append', 'prepend' ],
		HTMLElement: [ 'outerText', 'innerText' ],
		Element: [ 'append', 'prepend', 'before', 'after', 'insertAdjacentElement', 'insertAdjacentHTML', 'remove', 'replaceChildren', 'replaceWith', 'setHTML', 'innerHTML', 'outerHTML' ],
		CharacterData: [ 'before', 'after', 'remove', 'replaceWith' ],
		Node: [ 'insertBefore', 'replaceChild', 'removeChild', 'appendChild', 'textContent', 'nodeValue' ],
	};
	const _apiOriginals = {
		// Note the order
		ShadowRoot: Object.create( null ), // extends DocumentFragment
		DocumentFragment: Object.create( null ), // extends Node
		Document: Object.create( null ), // extends Node
		HTMLElement: Object.create( null ), // extends Element,
		Element: Object.create( null ), // extends Node
		CharacterData: Object.create( null ), // extends Node
		Node: Object.create( null ),
	};

	const _apiNamesUnique = new Set( Object.values( _apiNames ).reduce( ( all, apis ) => all.concat( apis ), [] ) );
	_apiNamesUnique.forEach( apiName => {
		
		Object.keys( _apiNames ).forEach( DOMClassName => {
			if ( !_apiNames[ DOMClassName ].includes( apiName ) ) return;
			const _apiOriginal = Object.getOwnPropertyDescriptor( window[ DOMClassName ].prototype, apiName );
			if ( !_apiOriginal ) return; // Typically: Element:setHTML
			Object.defineProperty( window[ DOMClassName ].prototype, apiName, 'value' in _apiOriginal ? { ..._apiOriginal, value: method } : { ..._apiOriginal, set: setter } );
			_apiOriginals[ DOMClassName ][ apiName ] = _apiOriginal;
		} );

		function method( ...args ) {
			const DOMClassName = Object.keys( _apiOriginals ).find( name => this instanceof window[ name ] && ( apiName in _apiOriginals[ name ] ) );
			const $apiOriginals = _apiOriginals[ DOMClassName ];
			// Instance of Node interface? Abort!
			let exec = () => $apiOriginals[ apiName ].value.call( this, ...args );
			if ( webqit.realdom.domInterceptionNoRecurse.get( this ) === apiName ) return exec();
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
					if ( !this.parentNode ) return $apiOriginals[ apiName ].value.call( this, ...args );
					tempNodeName = this.parentNode.nodeName;
				}
				const temp = document.createElement( tempNodeName );
				$apiOriginals.setHTML.value.call( temp, entrants[ 0 ], apiName === 'setHTML' ? args[ 1 ] : {} );
				entrants = [ ...temp.childNodes ];
				// --------------  
				if ( apiName === 'insertAdjacentHTML' ) {
					apiNameFinal = 'insertAdjacentElement';
					args[ 1 ] = new DocumentFragment;
					noRecurse( args[ 1 ], 'append', () => args[ 1 ].append( ...temp.childNodes ) );
				} else {
					apiNameFinal = 'replaceChildren';
					args = [ ...temp.childNodes ];
				}
			}
			// --------------
			const record = { target, entrants, exits, type: 'interception', event: [ this, apiName ] };
			return intercept( record, () => {
				return $apiOriginals[ apiNameFinal ].value.call( this, ...args );
			} );
		}

		function setter( value ) {
			const DOMClassName = Object.keys( _apiOriginals ).find( name => this instanceof window[ name ] && ( apiName in _apiOriginals[ name ] ) );
			const $apiOriginals = _apiOriginals[ DOMClassName ];
			// Instance of Node interface? Abort!
			let exec = () => $apiOriginals[ apiName ].set.call( this, value );
			if ( webqit.realdom.domInterceptionNoRecurse.get( this ) === apiName ) return exec();
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
				const temp = document.createElement( tempNodeName === 'TEMPLATE' || tempNodeName.includes( '-' ) ? 'div' : tempNodeName );
				noRecurse( temp, apiName, () => temp[ apiName ] = value );
				entrants = /*??[ ...temp.childNodes ];*/this instanceof HTMLTemplateElement ? [] : [ ...temp.childNodes ];
				// -------------- 
				if ( apiName === 'outerHTML' ) {
					value = new DocumentFragment;
					noRecurse( value, 'append', () => value.append( ...temp.childNodes ) );
					exec = () => noRecurse( this, 'replaceWith', () => Element.prototype.replaceWith.call( this, value ) );
				} else {
					if ( this instanceof HTMLTemplateElement ) {
						exec = () => noRecurse( this.conten, 'replaceChildren', () => this.content.replaceChildren( ...temp.childNodes ) );
					} else {
						exec = () => noRecurse( this, 'replaceChildren', () => Element.prototype.replaceChildren.call( this, ...temp.childNodes ) );
					}
				}
			}
			// -------------- 
			const record = { target, entrants, exits, type: 'interception', event: [ this, apiName ] };
			return intercept( record, exec );
		}
	} );

	return rm;
}
