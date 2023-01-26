
/**
 * @imports
 */
import { expect } from 'chai';
import jsdom from 'jsdom';
import init from '../src/index.js';

const doc = ( body = '', head = '' ) => {
    const instance  = new jsdom.JSDOM(`
    <!DOCTYPE html><html><head>
    ${head}
    </head>
    <meta name="oohtml" content="a=2" />
    <body>
    ${body}
    </body>
     <h1 attr1="attr-val1" attr2="attr-val2">Hello World!</h1>
     <p>Hello World!</p>
     <p>Hello World!</p>
     <p>Hello World!</p>
    </html>
    `);
    init.call( instance.window );
    return [ instance.window, instance.window.wq.dom ];
};

describe(`Test: Query & Realtime`, function() {

    describe(`Query`, function() {

        it(`Should do basic query`, function() {
            const [ { document }, dom ] = doc();
            const h1 = dom.querySelectorAll( 'h1' );
            const attrs = h1.attributes( [ 'attr1' ] );
            expect( document ).to.have.property( 'title' );
        });

    });

});