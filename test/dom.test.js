
/**
 * @imports
 */
import { expect } from 'chai';
import jsdom from 'jsdom';
import init from '../src/index.js';

const doc = ( head = '', body = '', callback = null, params = {} ) => {
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
            if ( callback ) callback( window, window.document, window.wq.dom );
        }
    } );
    // --------
    return [ instance.window, instance.window.document, instance.window.wq.dom ];
};

const delay = dur => new Promise( res => setTimeout( res, dur ) );

describe(`Test: observer`, function() {

    describe(`DOM Query`, function() {

        it(`Should do basic query`, async function() {
            const body = `            
            <h1>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let ul = document.createElement( 'ul' );
            section.appendChild( ul );
            document.body.appendChild( section );
            </script>
            <div><p>Hello World!</p></div>`;

            const [ window, document ] = doc( '', body, null, { runScripts: 'dangerously' } );
            window.wq.dom.realtime( document ).subtree( 'h1,p,ul', record => {
                window.testRecords.push( record );
            } );
            await delay( 70 );
            // -----------------
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 0 ].event ).to.be.null;
            expect( window.testRecords[ 1 ].event ).to.be.null;
            expect( window.testRecords[ 2 ].event ).to.be.null;
        });
    });

    describe(`DOM Observe`, function() {

        it(`Should do basic observe (async)`, async function() {
            const body = `            
            <h1>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let ul = document.createElement( 'ul' );
            section.appendChild( ul );
            document.body.appendChild( section );
            </script>
            <div><p>Hello World!</p></div>`;

            let controller;
            const [ window, document ] = doc( '', body, ( window, document, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                controller = window.wq.dom.realtime( document ).observe( 'h1,p,ul', record => {
                    window.testRecords.push( record );
                }, { subtree: true, eventDetails: true } );
            }, { runScripts: 'dangerously' } );
            await delay( 70 );
            // -----------------
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 0 ].event ).to.eq( 'parse' );
            expect( window.testRecords[ 1 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 1 ].event[ 1 ] ).to.eq( 'appendChild' );
            expect( window.testRecords[ 2 ].event ).to.eq( 'parse' );
            // -----------------
            let section = document.createElement( 'section' );
            let p = document.createElement( 'p' );
            section.appendChild( p );
            document.body.appendChild( section );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 4 );
            expect( window.testRecords[ 3 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 3 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            section.remove();
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'remove' );
            // -----------------
            controller.disconnect();
            document.body.appendChild( section );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'remove' );
        });

        it(`Should do static-sensitive observe (async)`, async function() {
            const body = `            
            <h1 style>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let ul = document.createElement( 'ul' );
            ul.toggleAttribute( 'style' );
            section.appendChild( ul );
            document.body.appendChild( section );
            </script>
            <div><p>Hello World!</p></div>`;

            let controller;
            const [ window, document ] = doc( '', body, ( window, document, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                controller = window.wq.dom.realtime( document ).observe( '[style]', record => {
                    window.testRecords.push( record );
                }, { subtree: true, staticSensitivity: true, eventDetails: true } );
            }, { runScripts: 'dangerously' } );
            await delay( 70 );
            // -----------------
            expect( window.testRecords ).to.have.length( 2 );
            expect( window.testRecords[ 0 ].event ).to.eq( 'parse' );
            expect( window.testRecords[ 1 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 1 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            document.querySelector( 'p' ).toggleAttribute( 'style' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].entrants ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 2 ].exits ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            let section = document.createElement( 'section' );
            let p = document.createElement( 'p' );
            p.toggleAttribute( 'style' );
            section.appendChild( p );
            document.body.appendChild( section );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 4 );
            expect( window.testRecords[ 3 ].entrants ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 3 ].exits ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 3 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 3 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            p.toggleAttribute( 'style' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].entrants ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 4 ].exits ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            controller.disconnect();
            p.toggleAttribute( 'style' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].entrants ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 4 ].exits ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
        });
    });

    describe(`DOM ObserveSync`, function() {

        it(`Should do basic observe (sync)`, async function() {
            const body = `            
            <h1>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let ul = document.createElement( 'ul' );
            section.appendChild( ul );
            document.body.appendChild( section );
            </script>
            <div><p>Hello World!</p></div>`;

            let controller;
            const [ window, document ] = doc( '', body, ( window, document, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                controller = window.wq.dom.realtime( document ).observe( 'h1,p,ul', record => {
                    window.testRecords.push( record );
                }, { subtree: true, timing: 'sync', eventDetails: true } );
            }, { runScripts: 'dangerously' } );
            await true;
            // -----------------
            expect( window.testRecords ).to.have.length( 3 );
            // Notice the order here; this is jsdom-specific
            expect( window.testRecords[ 1 ].event ).to.eq( 'parse' );
            expect( window.testRecords[ 0 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 0 ].event[ 1 ] ).to.eq( 'appendChild' );
            expect( window.testRecords[ 2 ].event ).to.eq( 'parse' );
            // -----------------
            let section = document.createElement( 'section' );
            let p = document.createElement( 'p' );
            section.appendChild( p );
            document.body.appendChild( section );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 4 );
            expect( window.testRecords[ 3 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 3 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            section.remove();
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'remove' );
            // -----------------
            controller.disconnect();
            document.body.appendChild( section );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'remove' );
        });

        it(`Should do static-sensitive observe (sync)`, async function() {
            const body = `            
            <h1 style>Hello World!</h1>
            <script>
            let section = document.createElement( 'section' );
            let ul = document.createElement( 'ul' );
            ul.toggleAttribute( 'style' );
            section.appendChild( ul );
            document.body.appendChild( section );
            </script>
            <div><p>Hello World!</p></div>`;

            let controller;
            const [ window, document ] = doc( '', body, ( window, document, { Realtime } ) => {
                // Observer is bound before document is parsed.
                // Elements are going to show up as they are being parsed.
                controller = window.wq.dom.realtime( document ).observe( '[style]', record => {
                    window.testRecords.push( record );
                }, { subtree: true, timing: 'sync', staticSensitivity: true, eventDetails: true } );
            }, { runScripts: 'dangerously' } );
            await true;
            // -----------------
            expect( window.testRecords ).to.have.length( 2 );
            // Notice the order here; this is jsdom-specific
            expect( window.testRecords[ 1 ].event ).to.eq( 'parse' );
            expect( window.testRecords[ 0 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 0 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            document.querySelector( 'p' ).toggleAttribute( 'style' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].entrants ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 2 ].exits ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            let section = document.createElement( 'section' );
            let p = document.createElement( 'p' );
            p.toggleAttribute( 'style' );
            section.appendChild( p );
            document.body.appendChild( section );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 4 );
            expect( window.testRecords[ 3 ].entrants ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 3 ].exits ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 3 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 3 ].event[ 1 ] ).to.eq( 'appendChild' );
            // -----------------
            p.toggleAttribute( 'style' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].entrants ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 4 ].exits ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            controller.disconnect();
            p.toggleAttribute( 'style' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 5 );
            expect( window.testRecords[ 4 ].entrants ).to.be.an( 'array' ).with.length( 0 );
            expect( window.testRecords[ 4 ].exits ).to.be.an( 'array' ).with.length( 1 );
            expect( window.testRecords[ 4 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 4 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
        });
    });
});

