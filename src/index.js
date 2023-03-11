
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
    if ( !window.wq ) window.wq = {};
    if ( window.wq.dom ) return window.wq.dom;
    window.wq.dom = {};
    polyfill.call( window );
    // ------
    const Reflow = _Reflow( window );
    window.wq.dom.Reflow = new Reflow;
    // ------
    window.wq.dom.DOMRealtime = DOMRealtime;
    window.wq.dom.AttrRealtime = AttrRealtime;
    window.wq.dom.realtime = ( context, namespace = 'tree' ) => {
        if ( namespace === 'tree' ) return new DOMRealtime( context, window );
        if ( namespace === 'attr' ) return new AttrRealtime( context, window );
    };
    // ------
    window.wq.dom.ready = ready.bind( window );
    window.wq.dom.meta = meta.bind( window );
    // ------
    return window.wq.dom;
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
 * A wq's meta tag props reader.
 *  
 * @param String name
 * @param Bool	 readWrite
 * 
 * @return Object
 */
function meta( name, readWrite = false ) {
    const window = this;
    const metaInstance = { content: {} };
    // Initialize reader
    if ( !(metaInstance.el = window.document.querySelector( `meta[name="${ name }"]` ) ) && readWrite ) {
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
    metaInstance.get = function( prop ) { return JSON.parse( JSON.stringify( _get( this.content, prop.split( '.' ) ) ) ); }
    // Copy...
    metaInstance.copy = function() {
		return JSON.parse( JSON.stringify( this.content ) );
    };
	// Copy with defaults...
    metaInstance.copyWithDefaults = function( ...defaults ) {
		if ( defaults.length ) return _merge( true, {}, ...defaults.reverse().concat( this.content ) );
		return this.copy();
    };
    return metaInstance;
}