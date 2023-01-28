
/**
 * @imports
 */
import { expect } from 'chai';
import jsdom from 'jsdom';
import init from '../src/index.js';
import { runInContext, createContext } from 'vm';

const doc = ( body = '', head = '', callback = null, params = {} ) => {
    // -------
    const skeletonDoc = `
    <!DOCTYPE html>
    <html>
        <head>${head}</head>
        <body>${body}</body>
    </html>`;
    // --------
    const instance  = new jsdom.JSDOM( skeletonDoc, {
        url: 'http://localhost',
        ...params,
        beforeParse( window ) {

            window.testRecords = [];
            init.call( window );

            // Run scripts
            createContext( window );
            window.scopedJs = {
                exec: script => { runInContext( script.textContent, window ); },
                scripts: [],
            }

            if ( callback ) callback( window, window.wq.dom );
        }
    } );
    // --------
    return [ instance.window, instance.window.wq.dom ];
};

const delay = dur => new Promise( res => setTimeout( res, dur ) );

describe(`Test: observer`, function() {

    describe(`Query`, function() {

        it(`Should do basic observe`, async function() {
            const body = `            
            <h1>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let p = document.createElement( 'p' );
            section.appendChild(p);
            document.body.appendChild(section);
            </script>
            <div><p>Hello World!</p></div>`;

            const [ window ] = doc( body, '', ( window, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                Realtime.observe( window.document, 'h1,p', record => {
                    window.testRecords.push( record.addedNodes[ 0 ] );
                }, { subtree: true } );
            }, { runScripts: 'dangerously' } );

            await delay( 60 );
            expect( window.testRecords ).to.have.length( 3 );
        });

        it(`Should do basic intercept`, async function() {
            const body = `
            <script scoped>
                testRecords.push( this );
            </script>`;

            const [ window ] = doc( body, '', ( window, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                Realtime.intercept( window.document, 'script[scoped]', record => {
                    const script = record.incomingNodes[ 0 ];
                    window.scopedJs.scripts[0] = script;
                    script.textContent = `(function() {
                        ${ script.textContent }
                    }).call( window.scopedJs.scripts[0].parentNode );`;
                    if ( window.scopedJs.exec ) {
                        window.scopedJs.exec( script );
                    }
                }, { subtree: true } );
            } );

            await delay( 60 );
            expect( window.testRecords ).to.have.length( 1 );
            expect( window.testRecords[ 0 ] ).to.eq( window.document.body );
        });

    });

});