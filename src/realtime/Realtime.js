
/**
 * @imports
 */
import { _isFunction, _isObject, _internals } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import DOMSpec from './DOMSpec.js';
import * as Util from './Util.js';

/**
 *
 * @class Realtime
 */
export default class Realtime {

	/**
	 * @constructor
	 *
	 * @param document|Element	context
	 */
	constructor( context, namespace, window ) {
		this.context = context;
		this.namespace = namespace;
		this.window = context.defaultView || context.ownerDocument?.defaultView || window;
		this.document = this.window.document;
		this.webqit = this.window.webqit;
		Object.defineProperty( this, '#', { value: {} } );
	}
	
	/**
	 * Resolves arguments
	 * 
	 * @param Array 			args 
	 * 
	 * @returns Array
	 */
	resolveArgs( args ) {
		if ( _isFunction( args[ 0 ] ) ) { args = [ [], ...args ]; }
		else if ( _isObject( args[ 0 ] ) && !( args[ 0 ] instanceof DOMSpec ) && args.length === 1 ) {
			args = [ [], undefined, args[ 0 ] ];
		} else if ( _isObject( args[ 1 ] ) && args.length === 2 ) {
			args = [ _arrFrom( args[ 0 ], false/*castObject*/ ), undefined, args[ 1 ] ];
		} else { args[ 0 ] = _arrFrom( args[ 0 ], false/*castObject*/ ); }
		if ( args[ 0 ].filter( x => typeof x !== 'string' && !( x instanceof DOMSpec ) && !( x instanceof this.window.Node ) ).length ) {
			throw new Error( `Argument #2 must be either a string or a Node object, or a list of those.` );
		}
		args[ 0 ] = args[ 0 ].map( s => s instanceof DOMSpec ? s : new DOMSpec( s ) );
		return args;
	}

	/**
	 * @registry
	 *
	 * @param Array				...args
	 * 
	 * @returns Map
	 */
	registry( ...args ) {
		return _internals( 'realdom.realtime', this.window, this.namespace, ...args );
	}
		
	/**
	 * @createSignalGenerator
	 * 
	 * @param Object 			mo 
	 * 
	 * @returns Object
	 */
	createSignalGenerator() {
		return {
			generate() {
				// Abort previous
				this.lastController?.abort();
				this.lastController = new AbortController;
				const flags = { signal: this.lastController.signal };
				return flags;
			},
			disconnect() { this.lastController?.abort(); }
		}
	}
		
	/**
	 * Loops through registration objects whose contexts match the event context.
	 * 
	 * @param String 		interceptionTiming
	 * @param Object|Array 	record_s
	 * @param Function 		callback 
	 * 
	 * @returns void
	 */
	forEachMatchingContext( interceptionTiming, record_s, callback ) {
		const { window } = this, records = Array.isArray( record_s ) ? record_s : [ record_s ];
		let dispatchBatch = new Set;
		for ( const [ depth, registries ] of this.registry( interceptionTiming ) ) {
			for ( const [ context, registry ] of registries ) {
				// Ensure event target is/within context
				let matches = records.filter( record => {
					if ( !Util.containsNode( window, context, record.target, depth === 'cross-roots' ) ) return false;
					return [ 'subtree', 'cross-roots' ].includes( depth ) || record.target === context;
				} );
				if ( !matches.length ) continue;
				// Records will be dispatched in their original form
				if ( !Array.isArray( record_s ) ) { matches = matches[ 0 ]; }
				for ( const registration of registry ) {
					dispatchBatch.add( [ registration, matches, context ] );
					//callback.call( window, registration, matches, context );
				}
			}
		}
		// Saving everything to dispatchBatch ensures that recursive modifications
		// to both this.registry( interceptionTiming ), registries, and registry aren't pciked up
		for ( const [ registration, record_s, context ] of dispatchBatch ) {
			callback.call( window, registration, record_s, context );
		}
	}

	/**
	 * @disconnectables
	 * 
	 * @param AbortSignal 		signal
	 * @param Array 			...objects 
	 * 
	 * @returns Object
	 */
	disconnectables( signal, ...objects ) {
		const disconnectable = { disconnect() {
			objects.forEach( d => (
				d && _isFunction( d.disconnect ) && d.disconnect() 
				|| _isFunction( d ) && d() 
				|| _isObject( d ) && ( d.disconnected = true )
			) );
		} };
		if ( signal ) signal.addEventListener( 'abort', () => disconnectable.disconnect() );
		return disconnectable;
	}
}
