
/**
 * @imports
 */
import polyfill from './polyfills.js';
import Mutations from './Mutations.js';
import createReflowClass from './Reflow.js';
import { ready, meta } from './Query.js';

export default function() {
    const window = this;
    if ( !window.wq ) window.wq = {};
    if ( window.wq.dom ) return window.wq.dom;
    // ------
    polyfill.call( window );
    const Reflow = createReflowClass( window );
    // ------
    window.wq.dom = new Mutations( window );
    window.wq.dom.reflow = new Reflow;
    window.wq.dom.ready = ready.bind( window );
    window.wq.dom.meta = meta.bind( window );
    // ------
    return window.wq.dom;
}