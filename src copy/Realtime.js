
/**
 * @imports
 */
import { _isString, _isFunction } from '@webqit/util/js/index.js';
import { _difference, _from as _arrFrom } from '@webqit/util/arr/index.js';
import _Query from './Query.js';

/**
 * ---------------------
 * Realtime Utilities
 * ---------------------
 */
export default ( window, Super = Array ) => class Realtime extends _Query( window, Super ) {

	/**
	 * ---------------------
	 * MUTATIONS
	 * ---------------------
	 */

	/**
	 * Binds a callback for currently-matched, and subsequently-changes attributes.
	 *
	 * @param array						attrs
	 * @param function					callback
	 * @param Object					params
	 *
	 * @return ObserverConnection
	 */
	attributes( attrs, callback, params = {} ) {
		if ( _isFunction( arguments[ 0 ], params ) ) {
			params = callback || {};
			callback = attrs;
			attrs = [];
		}
		let result = super.attributes( attrs );
		if ( result.length ) { callback( ...result ) }
		return this.attributeChangeCallback( attrs, callback, params );
	}

	/**
	 * Binds a callback for changed attributes.
	 *
	 * @param array						attrs
	 * @param function					callback
	 * @param Object					params
	 *
	 * @return ObserverConnection
	 */
	attributeChangeCallback( attrs, callback, params = {} ) {
		if ( _isFunction( arguments[ 0 ] ) ) {
			params = callback || {};
			callback = attrs;
			attrs = [];
		}
		const observer = new window.MutationObserver( mutations => {
			if ( !attrs.length ) {
				callback( ...Array.from( mutations ).reduce( ( attrs, mu ) => attrs.concat( {
					name: mu.attributeName,
					value: el.getAttribute( mu.attributeName ),
					oldValue: mu.oldValue,
				} ), [] ) );
				return;
			}
			callback( ...attrs.reduce( ( attrs, name ) => attrs.concat( el.getAttribute( name ) ), [] ) );
		} );
		params = { attributes: true, attributeOldValue: !attrs.length, subtree: params.subtree };
		if ( attrs.length ) { params.attributeFilter = attrs; }
		const el = this.get( 0, params );
		observer.observe( el, params );
		const _this = this;
		return {
			disconnect() {
				observer.disconnect();
				return { reconnect() {
					return _this.attributeChangeCallback( attrs, callback, params );
				} }
			}
		};
	}

	/**
	 * ---------------------
	 * PRESENCE
	 * ---------------------
	 */

	/**
	 * Binds a callback for current and subsequent children.
	 *
	 * @param function						callback
	 * @param Object						params
	 *
	 * @return ObserverConnection
	 */
	children( callback, params = {} ) {
		emit( super.children( params ), callback, params, 1 );
		const observer = new window.MutationObserver( mutations => {
			const [ removed__addedNodes, added__removedNodes, removedNodes, addedNodes ] = getMutationRecordNodes( mutations );
			emit( removed__addedNodes, callback, params, 0, 1 );
			emit( added__removedNodes, callback, params, 1, 0 );
			emit( removedNodes, callback, params, 0 );
			emit( addedNodes, callback, params, 1 );
		} );
		const el = this.get( 0, params );
		const _el = el instanceof window.HTMLTemplateElement ? el.content : el; 
		observer.observe( _el, { childList: true } );
		const _this = this;
		return {
			disconnect() {
				observer.disconnect();
				return { reconnect() {
					return _this.children( callback );
				} }
			}
		};
	}

	/**
	 * Binds a callback for currently-matched selector, and subsequently-connected elements.
	 *
	 * @param string						selector
	 * @param function						callback
	 * @param object						params
	 *
	 * @return ObserverConnection
	 */
	querySelectorAll( selector, callback, params = {} ) {
		const result = super.querySelectorAll( selector, params );
		emit( result, callback, params, 1 );
		const el = this.get( 0, params );
		return this.constructor.from( [ selector ] ).presenceChangeCallback( callback, { ...params, context: el || params.context } );
	}

	/**
	 * Binds a callback for currently-unmatched selector, and subsequently-disconnected elements.
	 *
	 * @param string|Element				selector
	 * @param function						callback
	 * @param object						params
	 *
	 * @return ObserverConnection
	 */
	querySelectorNone( selector, callback, params = {} ) {
		if ( super.querySelectorAll( selector, params ).length === 0 ) {
			if ( params.each ) { callback( null, 0 ); }
			else callback( [], 0 );
		}
		const el = this.get( 0, params );
		return this.constructor.from( [ selector ] ).presenceChangeCallback( callback, { ...params, context: el || params.context } );
	}
		
	/**
	 * Binds a callback for connected elements.
	 *
	 * @param function					callback
	 * @param object					params
	 *
	 * @return ObserverConnection
	 */
	connectedCallback( callback, params = {} ) {
		const result = [];
		this.each( el => {
			if ( !el.isConnected ) return;
			// Emit right away? Or collect...
			if ( params.each ) { callback( el, 1 ); }
			else { result.push( el ); }
		}, params );
		if ( result.length ) { callback( result, 1 ); }
		return this.presenceChangeCallback( callback, { ...params, on: 'added' } );
	}

	/**
	 * Binds a callback for disconnected elements.
	 *
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Object
	 */
	disconnectedCallback( callback, params = {} ) {
		const result = [];
		this.each( el => {
			if ( el.isConnected ) return;
			// Emit right away? Or collect...
			if ( params.each ) { callback( el, 0 ); }
			else { result.push( el ); }
		}, params );
		if ( result.length ) { callback( result, 0 ); }
		return this.presenceChangeCallback( callback, { ...params, on: 'removed' } );
	}

	/**
	 * Observes when the given elements or selectors are added or removed
	 * from the given context.
	 *
	 * @param function					callback
	 * @param object					params
	 *
	 * @return Object
	 */
	presenceChangeCallback( callback, params = {} ) {
		const search = ( el, [ ...nodeListArray ] ) => {
			// Filter out text nodes
			nodeListArray = nodeListArray.filter( node => node.matches );
			if ( _isString( el ) ) {
				// Is directly mutated...
				let matches = nodeListArray.filter( node => node.matches( el ) );
				// Is contextly mutated...
				if ( params.observeIndirectMutation !== false ) {
					matches = nodeListArray
						.reduce( ( collection, node ) => collection.concat( _arrFrom( node.querySelectorAll( el ) ) ), matches );
					if ( matches.length ) {
						return matches;
					}
				}
			} else {
				// Is directly mutated...
				if ( nodeListArray.includes( el ) ) {
					return [ el ];
				}
				// Is contextly mutated...
				if ( params.observeIndirectMutation !== false && nodeListArray.length ) {
					let parentNode = el;
					while( parentNode = parentNode.parentNode ) {
						if ( nodeListArray.includes( parentNode ) ) {
							return [ el ];
						}
					}
				}
			}
		};
		const match = ( els, sourceArray ) => {
			// -------------------------------
			// Search can be expensive...
			// Multiple listeners searching the same thing in the same list?
			if ( !sourceArray.$$searchCache ) {
				sourceArray.$$searchCache = new Map;
			}
			// -------------------------------
			return els.reduce( ( matches, el ) => {
				// -------------------------------
				let _matches;
				if ( sourceArray.$$searchCache.has( el ) ) {
					_matches = sourceArray.$$searchCache.get( el );
				} else {
					_matches = search( el, sourceArray, _isString( el ) ) || [];
					sourceArray.$$searchCache.set( el, _matches );
				}
				return matches.concat( _matches );
			}, [] );
		};
		const els = this;
		const totalConnected = new Set, totalDisconnected = new Set;
		const fire = ( list, connectedState, transientNewConnectedState ) => {
			if ( ( connectedState && params.on === 'removed' ) || ( !connectedState && params.on === 'added' ) ) {
				return;
			}
			if ( ( list = match( els, list ) ).length ) {
				list.forEach( el => {
					if ( connectedState ) {
						totalConnected.add( el );
						totalDisconnected.delete( el );
					} else {
						totalConnected.delete( el );
						totalDisconnected.add( el );
					}
				} );
				if ( params.maintainCallState ) {
					emit( list, callback, params, connectedState, transientNewConnectedState, totalConnected, totalDisconnected );
				} else {
					emit( list, callback, params, connectedState, transientNewConnectedState );
				}
			}
		};
		const context = params.context || window.document.documentElement;
		return contextObserverCallback.call( window, context, ( removed__addedNodes, added__removedNodes, removedNodes, addedNodes ) => {
			fire( removed__addedNodes, 0, 1 );
			fire( added__removedNodes, 1, 0 );
			fire( removedNodes, 0, 0 );
			fire( addedNodes, 1, 1 );
		} );
	}

}

/**
 * 
 * @param Set|Array nodeSet
 * @param Function callback
 * @param Object params
 * @param Array args
 * 
 * @return Void
 */
function emit( nodeSet, callback, params, ...args ) {
	if ( params.each ) { nodeSet.forEach( el => callback( el, ...args ) ); }
	else if ( ( nodeSet instanceof Set ) && nodeSet.size ) { callback( [ ...nodeSet ], ...args ); }
	else if ( Array.isArray( nodeSet ) && nodeSet.length ) { callback( nodeSet, ...args ); }
}

/**
 * 
 * @param Element context 
 * @param Function callback 
 * 
 * @return Object
 */
const MutationObserversCache = new Map();
function contextObserverCallback( context, callback ) {
	const window = this;
   if ( !MutationObserversCache.has( context ) ) {
	   const callbacks = new Set;
	   const observer = new window.MutationObserver( mutations => {
		   if ( !callbacks.size ) return;
		   const [ removed__addedNodes, added__removedNodes, removedNodes, addedNodes ] = getMutationRecordNodes( mutations );
		   callbacks.forEach( callback => callback( removed__addedNodes, added__removedNodes, removedNodes, addedNodes ) );
	   });
	   const _context = context instanceof window.HTMLTemplateElement ? context.content : context; 
	   observer.observe( _context, { childList: true, subtree: true } );
	   MutationObserversCache.set( context, { callbacks, observer } );
   }
   MutationObserversCache.get( context ).callbacks.add( callback );
   const controller = {
	   disconnect() {
		   const obs = MutationObserversCache.get( context );
		   obs.callbacks.delete( callback );
		   if ( !obs.callbacks.size ) {
				obs.observer.disconnect();
				MutationObserversCache.delete( context );
		   }
		   return { reconnect() {
				const obs = MutationObserversCache.get( context );
				if ( !obs ) return contextObserverCallback.call( window, context, callback );
				obs.callbacks.add( callback );
				return controller;
			} }
	   }
   };
   return controller;
}

/**
 * 
 * @param Array<MutationRecord> mutations 
 * 
 * @return Array
 */
function getMutationRecordNodes( mutations ) {
	const addedNodes = new Set, removed__addedNodes = new Set;
	const removedNodes = new Set, added__removedNodes = new Set;
	mutations.forEach( mu => {
		// Initial categorization for addedNodes and added__removedNodes
		mu.addedNodes.forEach( el => {
			if ( !el.isConnected ) {
				added__removedNodes.add( el );
			} else { addedNodes.add( el ); }
		} );
		// Complete categorization for removedNodes and removed__addedNodes
		mu.removedNodes.forEach( el => {
			if ( el.isConnected && addedNodes.has( el ) ) {
				addedNodes.delete( el );
				removed__addedNodes.add( el );
			} else { removedNodes.add( el ); }
		} );
		// Finalization for addedNodes and added__removedNodes
		added__removedNodes.forEach( el => {
			if ( !removedNodes.has( el ) ) {
				added__removedNodes.delete( el );
				addedNodes.add( el );
			}
		} );
	} );
	return [ removed__addedNodes, added__removedNodes, removedNodes, addedNodes ];
}
