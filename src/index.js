
/**
 * @imports
 */
import { _isNumeric } from '@webqit/util/js/index.js';
import { _set, _get, _merge } from '@webqit/util/obj/index.js';
import _Reflow from './_Reflow.js';
import DOMRealtime from './realtime/DOMRealtime.js';
import AttrRealtime from './realtime/AttrRealtime.js';
import polyfill from './polyfills.js';

export default function() {
    const window = this;
    if ( !window.webqit ) window.webqit = {};
    if ( window.webqit.dom ) return window.webqit.dom;
    window.webqit.dom = {};
    polyfill.call( window );
    // ------
    const Reflow = _Reflow( window );
    window.webqit.dom.Reflow = new Reflow;
    // ------
    window.webqit.dom.DOMRealtime = DOMRealtime;
    window.webqit.dom.AttrRealtime = AttrRealtime;
    window.webqit.dom.realtime = ( context, namespace = 'tree' ) => {
        if ( namespace === 'tree' ) return new DOMRealtime( context, window );
        if ( namespace === 'attr' ) return new AttrRealtime( context, window );
    };
    // ------
    window.webqit.dom.ready = ready.bind( window );
    window.webqit.dom.meta = meta.bind( window );
    // ------
    return window.webqit.dom;
}


/**
 * DOM-ready listeners.
 * 
 * @param Function	    		callback
 * 
 * @return void
 */
function ready( callback ) {
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
 * A webqit's meta tag props reader.
 *  
 * @param String name
 * 
 * @return Object
 */
function meta( name ) {
    const window = this;
    let _content, _el;
    if ( _el = window.document.querySelector( `meta[name="${ name }"]` ) ) {
        _content = ( _el.content || '' ).split( ';' ).filter( v => v ).reduce( ( _metaVars, directive ) => {
            const directiveSplit = directive.split( '=' ).map( d => d.trim() );
            _set( _metaVars, directiveSplit[ 0 ].split( '.' ), directiveSplit[ 1 ] === 'true' ? true : (directiveSplit[ 1 ] === 'false' ? false : (
                    _isNumeric( directiveSplit[ 1 ] ) ? parseInt( directiveSplit[ 1 ] ) : directiveSplit[ 1 ]
                ) )
            );
            return _metaVars;
        }, {} );
    }
    return { get name() { return name; }, get content() { return _el.content; }, json() {
		return JSON.parse( JSON.stringify( _content ) );
    } };
}