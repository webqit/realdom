
/**
 * @imports
 */
import { _isFunction, _isString, _isObject } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';

/**
 * ---------------------
 * Ctxt Mutations Utilities
 * ---------------------
 */

/**
 *
 * @var Map
 */
const MutationInterceptorsCache = [ new Map, new Map, ];
export default class Mutations {

	/**
	 *
	 * @return this
	 */
	constructor(window) {
		this.window = window;
	}

	/**
	 * Observes changes in attributes of the given element.
	 *
	 * @param Element					context
	 * @param array						filter
	 * @param function					callback
	 *
	 * @return MutationObserver
	 */
	attr( context, filter, callback ) {
		[ context, filter, callback ] = resolveArgs( arguments );
		const mo = new this.window.MutationObserver( records => {
			records.forEach( record => callback( record, context ) );
		} );
		const params = { attributes: true, attributeOldValue: true };
		if ( filter.length ) {
			params.attributeFilter = filter;
		}
		mo.observe( context, params );
		return mo;
	}
	
	/**
	 * Mutation matching
	 *
	 * @param document|Element			callback
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 *
	 * @return void
	 */
	match( context, selectors, callback, params = {} ) {
		[ context, selectors, callback, params = {} ] = resolveArgs( arguments );
		// ------------------
		const records = new Set, getRecord = target => {
			if ( !records.has( target ) ) {
				records.set( target, {
					target, 
					addedNodes: [], 
					removedNodes: [],
				} );
			}
			return records.get( target );
		};
		// ------------------
		if ( selectors.every( selector => _isString( selector ) ) && ( selectors = selectors.join( ',' ) ) ) {
			if ( params.on !== 'disconnected' ) {
				( params.subtree ? context.querySelectorAll( selectors ) : context.children || [] ).forEach( node => {
					getRecord( node.parentNode ).addedNodes.push( node );
				} );
			}
		} else if ( selectors.every( selector => _isObject( selector ) ) ) {
			if ( context !== document || params.subtree ) {
				selectors.forEach( node => {
					const isConnected = context === document ? node.isConnected : (
						node.parentNode === context || ( params.subtree && context.contains( node ) )
					);
					if ( ( params.on === 'connected' && !isConnected ) || ( params.on === 'disconnected' && isConnected ) ) return;
					getRecord( node.parentNode )[ isConnected ? 'addedNodes' : 'removedNodes' ].push( node );
				} );
			}
		}
		// ------------------
		records.forEach( record => callback( record, context ) );
		// ------------------
		return this.observe( ...arguments );
	}

	/**
	 * Mutation Observer
	 * 
	 * @param document|Element			callback
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Object
	 */
	observe( context,  selectors, callback, params = {} ) {
		[ context, selectors, callback, params = {} ] = resolveArgs( arguments );
		const mo = new this.window.MutationObserver( records => {
			records.forEach( ( { target, addedNodes, removedNodes } ) => {
				emit.call( this, context, {
					target,
					addedNodes,
					removedNodes,
					type: 'mutation-observer',
				}/*!important*/, {
					selectors,
					callback,
					params,
				} );
			} );
		} );
		const connect = () => mo.observe( context, { childList: true, subtree: params.subtree, } );
		connect();
		// -------------
		const controller = {
			disconnect() {
				mo.disconnect();
				return {
					reconnect() {
						connect();
						return controller;
					},
				};
			},
		};
		return controller;
	}
	
	/**
	 * Mutation Interceptor
	 * 
	 * @param document|Element			callback
	 * @param array|Element|string		selectors
	 * @param function					callback
	 * @param object					params
	 * 
	 * @returns Object
	 */
	intercept( context, selectors, callback, params = {} ) {
		[ context, selectors, callback, params = {} ] = resolveArgs( arguments );
		// -------------
		if ( !MutationInterceptorsCache.intercepting ) {
			console.warn( `DOM mutation APIs are now being intercepted.` )
			MutationInterceptorsCache.intercepting = true;
			const { document, Element } = this.window;
			// -----------
			// Interception handler
			// -----------
			const intercept = record => {
				MutationInterceptorsCache.forEach( ( contexts, index ) => {
					contexts.forEach( ( traps, context ) => {
						if ( !( record.target === context || ( index && ( context === document && record.target.isConnected || context.contains( record.target ) ) ) ) ) return;
						traps.forEach( trap => {
							if ( record.type === 'mutation-observer' ) {
								// Mutation observers can already every elements from HTML parse stream 
								trap = { ...trap, params: { ...trap.params, deepIntersect: false } };
							} else {
								record.incomingNodes.concat( record.outgoingNodes ).forEach( node => {
									node.wqIntercepted = true;
								} );
							}
							emit.call( this, context, record, trap );
						} );
					} );
				} );
			};
 			// -----------
			// Intercept DOM mutation methods
			// -----------
			const originalApis = Object.create( null );
			// -----------
            [
				'insertBefore'/*Node*/, 'insertAdjacentElement', 'insertAdjacentHTML', 'setHTML',
				'replaceChildren', 'replaceWith', 'remove', 'replaceChild'/*Node*/, 'removeChild'/*Node*/, 
				'before', 'after', 'append', 'prepend', 'appendChild'/*Node*/, 'prependChild', 
			].forEach( apiName => {
				// We'll be sure to monkey the correct interface
				const Interface = [ 'insertBefore', 'replaceChild', 'removeChild', 'appendChild' ].includes( apiName ) ? Node : Element;
                originalApis[ apiName ] = Interface.prototype[ apiName ];
				// In case newer methods like setHTML() are not supported
				if ( !originalApis[ apiName ] ) return;
				// Monkey now...
                Interface.prototype[ apiName ] = function( ...args ) {
					// Instance of Node interface? Abort!
					if ( !( this instanceof Element ) ) return originalApis[ apiName ].call( this, ...args );
					// --------------
					// Obtain outgoingNodes and incomingNodes
					let outgoingNodes = [], incomingNodes = [], target = this;
					if ( [ 'insertBefore' ].includes( apiName ) ) {
						incomingNodes = [ args[ 0 ] ];
					} else if ( [ 'insertAdjacentElement', 'insertAdjacentHTML' ].includes( apiName ) ) {
						incomingNodes = [ args[ 1 ] ];
						if ( [ 'beforebegin', 'afterend' ].includes( args[ 0 ] ) ) {
							target = this.parentNode;
						}
					} else if ( [ 'setHTML', 'replaceChildren' ].includes( apiName ) ) {
						outgoingNodes = [ ...this.childNodes ];
						incomingNodes = apiName === 'replaceChildren' ? [ ...args ] : [ args[ 0 ] ];
					} else if ( [ 'replaceWith', 'remove' ].includes( apiName ) ) {
						outgoingNodes = [ this ];
						incomingNodes = apiName === 'replaceWith' ? [ ...args ] : [];
						target = this.parentNode;
					} else if ( ['replaceChild' ].includes( apiName ) ) {
						outgoingNodes = [ args[ 1 ] ];
						incomingNodes = [ args[ 0 ] ];
					} else if ( ['removeChild' ].includes( apiName ) ) {
						outgoingNodes = [ ...args ];
					} else {
						// 'before', 'after', 'append', 'prepend', 'appendChild', 'prependChild'
						incomingNodes = [ ...args ];
						if ( [ 'before', 'after' ].includes( apiName ) ) {
							target = this.parentNode;
						}
					}
					// --------------
					// Parse HTML to incomingNodes
					let apiNameFinal = apiName;
					if ( [ 'insertAdjacentHTML', 'setHTML' ].includes( apiName ) ) {
						let tempNodeName = this.nodeName;
						if ( apiName === 'insertAdjacentHTML' && [ 'beforebegin', 'afterend' ].includes( args[ 0 ] ) ) {
							// We can't handle this... and this is going to throw afterall
							if ( !this.parentNode ) return originalApis[ apiName ].call( this, ...args );
							tempNodeName = this.parentNode.nodeName;
						}
						const temp = document.createElement( tempNodeName );
						originalApis.setHTML.call( temp, incomingNodes[ 0 ], apiName === 'setHTML' ? args[ 1 ] : {} );
						incomingNodes = [ ...temp.childNodes ];
						// --------------  
						if ( apiName === 'insertAdjacentHTML' ) {
							apiNameFinal = 'insertAdjacentElement';
							args[ 1 ] = new DocumentFragment;
							args[ 1 ].append( ...temp.childNodes );
						} else {
							apiNameFinal = 'replaceChildren';
							args = [ ...temp.childNodes ];
						}
					}
					// --------------
					intercept( { target, incomingNodes, outgoingNodes, type: 'mutation-interception', event: [ this, apiName ] } );
					// --------------
					return originalApis[ apiNameFinal ].call( this, ...args );
                }
            } );
			// -----------
			// Intercept DOM mutation properties
			// -----------
			[
				'outerHTML', 'outerText'/*HTMLElement*/, 'innerHTML', 
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
					// Obtain outgoingNodes and incomingNodes
					let outgoingNodes = [], incomingNodes = [], target = this;
					if ( [ 'outerHTML', 'outerText' ].includes( apiName ) ) {
						outgoingNodes = [ this ];
						target = this.parentNode;
					} else {
						// 'innerHTML', 'innerText', 'textContent', 'nodeValue'
						outgoingNodes = [ ...this.childNodes ];
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
						const temp = document.createElement( tempNodeName );
						originalApis[ apiName ].set.call( temp, value );
						incomingNodes = [ ...temp.childNodes ];
						// -------------- 
						if ( apiName === 'outerHTML' ) {
							value = new DocumentFragment;
							value.append( ...temp.childNodes );
							exec = () => originalApis.replaceWith.call( this, value );
						} else {
							exec = () => originalApis.replaceChildren.call( this, ...temp.childNodes );
						}
					}
					// -------------- 
					intercept( { target, incomingNodes, outgoingNodes, type: 'mutation-interception', event: [ this, apiName ] } );
					// -------------- 
                    return exec();
                } } );
            } );
			// -----------
			// Intercept document mutation methods
			// -----------
            [ 'append', 'prepend' ].forEach( apiName => {
                const originalApi = document[ apiName ];
                document[ apiName ] = function( ...args ) {
					intercept( {
						target: document,
						incomingNodes: args,
						outgoingNodes: [],
						type: 'mutation-interception', 
						event: [ document, apiName ]
					} );
                    return originalApi.call( this || document, ...args );
                }
            } );
			// -----------
			// If the document is still loading,
			// observe the ongoing document parser stream
			// -----------
			if ( document.readyState === 'loading' ) {
				const controller = this.observe( document, ( { target, addedNodes, removedNodes, type, } ) => {
					intercept( {
						target,
						incomingNodes: addedNodes,
						outgoingNodes:removedNodes,
						type,
					} );
				}, { subtree: true, filter: node => !node.wqIntercepted } );
				document.addEventListener( 'readystatechange', () => {
					controller.disconnect();
				} );
			}
			// -----------
		}
		// -------------
		const contexts = MutationInterceptorsCache[ params.subtree ? 1 : 0 ];
		if ( !contexts.has( context ) ) { contexts.set( context, new Set ); }
		// -------------
		const traps = contexts.get( context );
		const trap = { selectors, callback, params, };
		traps.add( trap );
		// -------------
		const controller = {
			disconnect() {
				traps.delete( trap );
				if ( !traps.size ) { contexts.delete( context ); }
				return {
					reconnect() {
						if ( !traps.size ) {
							return this.intercept( context, selectors, callback, params );
						}
						traps.add( trap );
						return controller;
					},
				};
			},
		};
		// -------------
		return controller;
	}

};

/**
 * Resolves arguments
 * 
 * @param Array 			args 
 * 
 * @returns Array
 */
function resolveArgs( args ) {
	if ( _isFunction( args[ 1 ] ) ) {
		args = [ args[ 0 ], [], ...[ ...args ].slice( 1 ) ];
	} else {
		args[ 1 ] = _arrFrom( args[ 1 ], false/*castObject*/ );
	}
	return args;
}

/**
 * Resolves arguments
 * 
 * @param Document|Element 	context 
 * @param Object 			record 
 * @param Object 			trap 
 * 
 * @returns Array
 */
function emit( context, record, trap ) {
	let matches;
	[ 'addedNodes', 'incomingNodes', 'removedNodes', 'outgoingNodes' ].forEach( prop => {
		if ( !( prop in record ) ) return;
		const isExit = [ 'removedNodes', 'outgoingNodes' ].includes( prop );
		if ( ( isExit && trap.params.on === 'connected' ) || ( !isExit && trap.params.on === 'disconnected' ) ) {
			record[ prop ] = [];
		} else if ( !trap.selectors.length ) {
			record[ prop ] = [ ...record[ prop ] ];
			matches = true;
		} else if ( ( record[ prop ] = intersectNodes.call(
			this,
			trap.selectors,
			record[ prop ],
			trap.params.deepIntersect,
			trap.params.filter
		) ).length ) {
			matches = true;
		}
	} );
	if ( matches ) {
		trap.callback( record, context );
	}
}

/**
 * Aggregates instances of els in sources
 * 
 * @param Array 			targets 
 * @param Array 			sources 
 * @param Bool 				deep 
 * @param Function 			filter 
 * 
 * @returns 
 */
function intersectNodes( targets, sources, deep = true, filter = null ) {
	sources = Array.isArray( sources ) ? sources : [ ...sources ];
	const match = ( sources, target ) => {
		// Filter out text nodes
		sources = sources.filter( source => source.matches );
		if ( _isString( target ) ) {
			// Is directly mutated...
			let matches = sources.filter( source => source.matches( target ) && ( !filter || filter( source ) ) );
			// Is contextly mutated...
			if ( deep !== false ) {
				matches = sources
					.reduce( ( collection, source ) => {
						let result = source.querySelectorAll( target );
						if ( filter ) { result = Array.prototype.filter.call( result, filter ); }
						return [ ...collection, ...result ];
					}, matches );
			}
			if ( matches.length ) {
				return matches;
			}
		} else {
			// Is directly mutated...
			if ( sources.includes( target )
			|| ( deep !== false && sources.some( source => source.contains( target ) ) ) ) {
				if ( !filter || filter( target ) ) {
					return [ target ];
				}
			}
		}
	};
	// -------------------------------
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
