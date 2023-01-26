
/**
 * @imports
 */
import { _isString } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _isNumeric } from '@webqit/util/js/index.js';
import { _set, _get, _merge } from '@webqit/util/obj/index.js';

/**
 * ---------------------
 * Query Utilities
 * ---------------------
 */
export default ( window, Super = Array ) => class Query extends Super {

	/**
	 * Starts the loop.
	 *
	 * @param Array<Element>		...selection
	 * 
	 * @return this
	 */
	constructor( ...selection ) {
		super( ...selection );
		Object.defineProperty( this, 'window', { value: window } );
	}

	/**
	 * Returns the item at the specified index resolved to an element.
	 *
	 * @param Number	index
	 * @param Object	params
	 * 
	 * @return Element
	 */
	get( index, params = {} ) {
		let el = this[ index ];
		return resolve.call( window, el, params.context, false );
	}
	
	/**
	 * Runs a callback thru each item resolved to an element.
	 *
	 * @param Function	callback
	 * @param Object	params
	 * 
	 * @return Element
	 */
	each( callback, params = {} ) {
		this.forEach( ( el, i ) => {
			( el = this.get( i, params ) ) && callback( el );
		} );
	}

	/**
	 * Gets a list of attributes.
	 *
	 * @param array						attrs
	 *
	 * @return Array
	 */
	attributes( attrs = [] ) {
		const el = this.get( 0 );
		if ( !el ) return [];
		if ( attrs.length ) return attrs.reduce( ( result, name ) => result.concat( el.getAttribute( name ) ), [] );
		return Array.from( el.attributes ).reduce( ( result, attr ) => result.concat( { name: attr.name, value: attr.value } ), [] );
	}

	/**
	 * Gets the list of children.
	 *
	 * @param Object	params
	 * 
	 * @return Array
	 */
	children( params = {} ) {
		const el = this.get( 0, params );
		if ( !el ) return this.constructor.from( [] );
		return this.constructor.from( el instanceof this.window.HTMLTemplateElement ? el.content.children : el.children );
	}

	/**
	 * Binds a callback for currently-matched selector, and subsequently-connected elements.
	 *
	 * @param string						selector
	 * @param object						params
	 *
	 * @return Array
	 */
	querySelectorAll( selector, params = {} ) {
		const context = this.get( 0, params ) || params.context || window.document.documentElement;
		return this.constructor.from( select.call( window, selector, context, true ) );
	}

}
 
/**
 * Resolves an HTML markup, selector, HTMLElement to
 * an HTMLElement, or list of HTMLElements.
 *
 * @param mixed 				input
 * @param document|Element	    context
 * @param bool		 			all
 *
 * @return Element|Array
 */
export function resolve( input, context = null, all = true ) {
	const window = this;
	if ( _isString( input ) ) {
		let els;
		if ( input.trim().startsWith( '<' ) ) {
			// Create a node from markup
			var temp = window.document.createElement( 'div' );
			temp.innerHTML = input;
			els = all ? temp.children : temp.firstChild;
		} else {
			els = select.call( window, input, context, all );
		}
		return els;
	}
	if ( input instanceof window.Element ) {
		return all ? [ input ] : input;
	}
	return all ? _arrFrom( input, false ) : input;
}

/**
 * Queries a DOM context for elements matching
 * the given selector.
 *
 * @param string 				selector
 * @param document|Element	    context
 * @param bool		 			all
 *
 * @return Element|DOMNodeList
 */
export function select( selector, context = null, all = true ) {
	const window = this;
    context = context || window.document;
	var matchedItems, method = all ? 'querySelectorAll' : 'querySelector';
	try {
		matchedItems = context[ method ]( selector );
	} catch( e ) {
		try {
			matchedItems = context[ method ]( selector.replace( /\:is\(/g, ':matches(' ) );
		} catch( e ) {
			try {
				matchedItems = context[ method ]( selector.replace( /\:is\(/g, ':-webkit-any(' ) );
			} catch( e ) {
				try {
					matchedItems = context[ method ]( selector.replace( /\:is\(/g, ':-moz-any(' ) );
				} catch( e ) {
					throw e;
				}
			}
		}
	}
	return matchedItems;
}

/**
 * DOM-ready listeners.
 * 
 * @param Function	    		callback
 * 
 * @return void
 */
export function ready( callback ) {
	const window = this;
	if ( window.document.readyState === 'complete' ) {
		callback( window );
	} else {
		if ( !window.document.domReadyCallbacks ) {
			window.document.domReadyCallbacks = [];
			window.document.addEventListener( 'DOMContentLoaded', () => {
				window.document.domReadyCallbacks.splice( 0 ).forEach( cb => cb( window ) );
			}, false );
		}
		window.document.domReadyCallbacks.push( callback );
	}
}

/**
 * A wq's meta tag props reader.
 *  
 * @param String name
 * @param Bool	 readWrite
 * 
 * @return Object
 */
export function meta( name, readWrite = false ) {
    const window = this;
    const metaInstance = { content: {} };
    // Initialize reader
    if ( !(metaInstance.el = window.document.querySelector( 'meta[name="oohtml"]' ) ) && readWrite ) {
        metaInstance.el = window.document.createElement( 'meta' );
        metaInstance.el.setAttribute( 'name', name );
        window.document.head.append( metaInstance.el );
    }
    if ( metaInstance.el ) {
        metaInstance.content = ( metaInstance.el.getAttribute( 'content' ) || '' ).split( ';' ).filter( v => v ).reduce( ( _metaVars, directive ) => {
            const directiveSplit = directive.split( '=' ).map( d => d.trim() );
            _set( _metaVars, directiveSplit[ 0 ].split( '.' ), directiveSplit[ 1 ] === 'true' 
                ? true : (directiveSplit[ 1 ] === 'false' ? false : (
                    _isNumeric( directiveSplit[ 1 ] ) ? parseInt( directiveSplit[ 1 ] ) : directiveSplit[ 1 ]
                ) )
            );
            return _metaVars;
        }, {} );
    }
    // Read prop...
    metaInstance.get = function(prop) { return JSON.stringify( _get( this.content, prop.split( '.' ) ) ); }
    // Copy...
    metaInstance.copy = function() {
		return JSON.stringify( this.content );
    };
	// Copy with defaults...
    metaInstance.copyWithDefaults = function( ...defaults ) {
		if ( defaults.length ) return _merge( true, {}, ...defaults.reverse().concat( this.content ) );
		return this.copy();
    };
    return metaInstance;
}