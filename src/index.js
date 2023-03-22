
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
function ready( callback, state = 'interactive' ) {
    const states = { interactive: [ 'interactive', 'complete' ], complete: [ 'complete' ], };
    if ( !states[ state ] ) return;
	const window = this;
    // --------------
	if ( states[ state ].includes( window.document.readyState ) ) return callback( window );
    // --------------
    if ( !window.webqit.dom.readyStateCallbacks ) {
        window.webqit.dom.readyStateCallbacks = { interactive: [], complete: [] };
        window.document.addEventListener( 'readystatechange', () => {
            const state = window.document.readyState;
            for ( const callback of window.webqit.dom.readyStateCallbacks[ state ].splice( 0 ) ) {
                callback( window );
            }
        }, false );
    }
    window.webqit.dom.readyStateCallbacks[ state ].push( callback );
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
    let _content = {}, _el;
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