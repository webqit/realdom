
/**
 * @imports
 */
import _each from '@webqit/util/obj/each.js';

/**
 * ---------------------------
 * Binds callbacks to requestAnimationFrame()
 * to create a central "read/write" phases for Ctxt access.
 * ---------------------------
 */
			
export default window => class Reflow {

	/**
	 * Starts the loop.
	 *
	 * @return this
	 */
	constructor( asyncDOM = true ) {
		Object.defineProperty( this, 'window', { value: window } );
		Object.defineProperty( this, 'readCallbacks', { value: new Set } );
		Object.defineProperty( this, 'writeCallbacks', { value: new Set } );
		this.async = asyncDOM;
		if ( this.window.requestAnimationFrame ) {
			this._run();
		} else {
			this.async = false;
		}
	}

	_run() {
		this.window.requestAnimationFrame( () => {
			this.readCallbacks.forEach( callback => {
				if ( !callback() ) {
					this.readCallbacks.delete( callback );
				}
			} );
			this.writeCallbacks.forEach( callback => {
				if ( !callback() ) {
					this.writeCallbacks.delete( callback );
				}
			} );
			this._run();
		} );
	}
	
	/**
	 * Binds a callback to the "read" phase.
	 *
	 * @param function 	callback
	 * @param bool		withPromise
	 *
	 * @return void
	 */
	onread( callback, withPromise = false ) {
		if ( withPromise ) {
			return new Promise( ( resolve, reject ) => {
				if ( this.async === false ) {
					callback( resolve, reject );
				} else {
					this.readCallbacks.add( () => {
						callback( resolve, reject );
					} );
				}
			} );
		}
		if ( this.async === false ) {
			callback();
		} else {
			this.readCallbacks.add( callback );
		}
	}
	
	/**
	 * Binds a callback to the "write" phase.
	 *
	 * @param function 	callback
	 * @param bool		withPromise
	 *
	 * @return void
	 */
	onwrite( callback, withPromise = false ) {
		if ( withPromise ) {
			return new Promise( ( resolve, reject ) => {
				if ( this.async === false ) {
					callback( resolve, reject );
				} else {
					this.writeCallbacks.add( () => {
						callback( resolve, reject );
					} );
				}
			} );
		}
		if ( this.async === false ) {
			callback();
		} else {
			this.writeCallbacks.add( callback );
		}
	}
	
	/**
	 * A special construct for Ctxt manipulations that span
	 * one or more read/write cycles.
	 *
	 * @param function 	read
	 * @param function 	write
	 * @param mixed		prevTransaction
	 *
	 * @return void|mixed
	 */
	cycle( onread, onwrite, prevTransaction ) {
		this.onread( () => {
			// Record initial values
			const readReturn = onread( prevTransaction );
			// Call erite, the transation
			const callWrite = ( readReturn ) => {
				if ( readReturn === undefined ) return;
				this.onwrite( () => {
					const writeReturn = onwrite( readReturn, prevTransaction );
					// Repeat transaction
					const repeatTransaction = ( writeReturn ) => {
						if ( writeReturn === undefined ) return;
						this.cycle( onread, onwrite, writeReturn );
					};
					// ---------------------------------------
					// If "write" returns a promise, we wait until it is resolved
					// ---------------------------------------
					if ( writeReturn instanceof Promise ) {
						writeReturn.then( repeatTransaction );
					} else {
						repeatTransaction( writeReturn );
					}
				} );
			};
			// ---------------------------------------
			// If "read" returns a promise, we wait until it is resolved
			// ---------------------------------------
			if ( readReturn instanceof Promise ) {
				readReturn.then( callWrite );
			} else {
				callWrite( readReturn );
			}
		} );
	}

}