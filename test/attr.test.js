
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

    describe(`Attr Query`, function() {

        it(`Should do basic query`, async function() {
            const body = `
            <div attr1="attr1-value"></div>`;

            const [ window, document ] = doc( '', body );
            const div = document.querySelector( 'div' );
            window.wq.dom.realtime( div, 'attr' ).get( records => {
                window.testRecords.push( ...records );
            } );
            await delay( 70 );
            // -----------------
            expect( window.testRecords ).to.have.length( 1 );
            expect( window.testRecords[ 0 ].event ).to.be.null;
        });
    });

    describe(`Attr Observe`, function() {

        it(`Should do basic observe (async)`, async function() {
            const body = `
            <div attr1="attr1-value"></div>`;

            const [ window, document ] = doc( '', body );
            const div = document.querySelector( 'div' );
            const controller = window.wq.dom.realtime( div, 'attr' ).observe( records => {
                window.testRecords.push( ...records );
            }, { newValue: true, oldValue: true, eventDetails: true } );
            div.setAttribute( 'attr2', 'attr2-value' );
            await delay( 70 );
            // -----------------
            expect( window.testRecords ).to.have.length( 1 );
            expect( window.testRecords[ 0 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 0 ].event[ 1 ] ).to.eq( 'setAttribute' );
            // -----------------
            div.toggleAttribute( 'attr2' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 2 );
            expect( window.testRecords[ 1 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 1 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            div.toggleAttribute( 'attr2' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            controller.disconnect();
            div.removeAttribute( 'attr2' );
            await delay( 70 );
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
        });
    });

    describe(`Attr ObserveSync`, function() {

        it(`Should do basic observe (sync)`, async function() {
            const body = `
            <div attr1="attr1-value"></div>`;

            const [ window, document ] = doc( '', body );
            const div = document.querySelector( 'div' );
            const controller = window.wq.dom.realtime( div, 'attr' ).observe( records => {
                window.testRecords.push( ...records );
            }, { timing: 'sync', newValue: true, oldValue: true, eventDetails: true } );
            div.setAttribute( 'attr2', 'attr2-value' );
            //await delay( 70 ); observeSync() runs sync
            // -----------------
            expect( window.testRecords ).to.have.length( 1 );
            expect( window.testRecords[ 0 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 0 ].event[ 1 ] ).to.eq( 'setAttribute' );
            // -----------------
            div.toggleAttribute( 'attr2' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 2 );
            expect( window.testRecords[ 1 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 1 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            div.toggleAttribute( 'attr2' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
            // -----------------
            controller.disconnect();
            div.removeAttribute( 'attr2' );
            //await delay( 70 ); observeSync() runs sync
            expect( window.testRecords ).to.have.length( 3 );
            expect( window.testRecords[ 2 ].event ).to.be.an( 'array' ).with.length( 2 );
            expect( window.testRecords[ 2 ].event[ 1 ] ).to.eq( 'toggleAttribute' );
        });
    });

});