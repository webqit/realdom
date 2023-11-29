
/**
 * ---------------------------
 * Binds callbacks to requestAnimationFrame()
 * to create a central "read/write" phases for Ctxt access.
 * ---------------------------
 */
			
export default class Scheduler {

	/**
	 * Starts the loop.
	 *
	 * @return this
	 */
	constructor( window, synthesis = false ) {
		Object.defineProperty( this, 'window', { value: window } );
		Object.defineProperty( this, 'readCallbacks', { value: new Set } );
		Object.defineProperty( this, 'writeCallbacks', { value: new Set } );
		Object.defineProperty( this, '_synthesis', { value: 0, writable: true } );
		if ( !synthesis && this.window.requestAnimationFrame ) {
			this._loop();
		} else { this._synthesis ++; }
	}

	get synthesis() { return this._synthesis; }

	async synthesizeWhile( callback ) {
		this._synthesis ++;
		this._fulfill();
		const returnValue = await callback();
		this._synthesis --;
		return returnValue;
	}

	_fulfill() {
		for ( const callback of this.readCallbacks ) {
			callback();
			this.readCallbacks.delete( callback );
		}
		for ( const callback of this.writeCallbacks ) {
			callback();
			this.writeCallbacks.delete( callback );
		}
	}

	_loop() {
		this.window.requestAnimationFrame( () => {
			this._fulfill();
			this._loop();
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
			return new Promise( resolve => {
				if ( this.synthesis ) {
					resolve( callback() );
				} else {
					this.readCallbacks.add( () => {
						resolve( callback() );
					} );
				}
			} );
		}
		if ( this.synthesis ) {
			queueMicrotask( callback );
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
			return new Promise( resolve => {
				if ( this.synthesis ) {
					resolve( callback() );
				} else {
					this.writeCallbacks.add( () => {
						resolve( callback() );
					} );
				}
			} );
		}
		if ( this.synthesis ) {
			queueMicrotask( callback );
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