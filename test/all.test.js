
/**
 * @imports
 */
import { expect } from 'chai';
import jsdom from 'jsdom';
import init from '../src/index.js';

const doc = ( body = '', head = '', callback = null ) => {
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
        runScripts: 'dangerously',
        beforeParse( window ) {
            window.testRecords = [];
            init.call( window );
            if ( callback ) callback( window, window.wq );
        }
    } );
    // --------
    return [ instance.window, instance.window.wq ];
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

            const [ window ] = doc( body, '', ( window, { MutationObserver } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                MutationObserver.observe( window.document, 'h1,p', record => {
                    window.testRecords.push( record.addedNodes[ 0 ] );
                }, { subtree: true } );
            } );


            await delay( 600 );
            expect( window.testRecords ).to.have.length( 3 );
        });

        it(`Should do basic intercept`, async function() {
            const body = `
            <script scoped>
                testRecords.push( this );
            </script>`;

            const [ window ] = doc( body, '', ( window, { MutationObserver } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                MutationObserver.intercept( window.document, 'script[scoped]', record => {
                    const script = record.incomingNodes[ 0 ];
                    script.textContent = `(function() {
                        ${ script.textContent }
                    }).call( document.currentScript.parentNode );`;
                }, { subtree: true } );
            } );


            await delay( 600 );
            expect( window.testRecords ).to.have.length( 1 );
            //expect( window.testRecords[ 0 ] ).to.eq( window.document.body );
        });

    });

});