
/**
 * @imports
 */
import createQueryClass, { ready, meta } from './query.js';
import createReflowClass from './Reflow.js';
import createRealtimeClass from './Realtime.js';
import polyfill from './polyfills.js';

export default function() {
    const window = this;
    if ( !window.wq ) window.wq = {};
    if ( window.wq.dom ) return window.wq.dom;
    // ------
    const Query = createQueryClass( window );
    const Reflow = createReflowClass( window );
    const Realtime = createRealtimeClass( window );
    Query.prototype.realtime = function( ...args ) {
        return args.length ? new Realtime( ...args ) : new Realtime( ...this );
    };
    // ------
    window.wq.dom = new Query;
    window.wq.dom.reflow = new Reflow;
    window.wq.dom.ready = ready.bind( window );
    window.wq.dom.meta = meta.bind( window );
    window.wq.dom.extend = ( nethodName, handler, { realtime = false } = {} ) => {
        if ( realtime !== 'only' ) { Query.prototype[ nethodName ] = handler; }
        if ( realtime ) { Realtime.prototype[ nethodName ] = handler; }
    };
    polyfill.call( window );
    // ------
    return window.wq.dom;
}