
/**
 * @imports
 */
import * as Xpath from './Xpath.js';

export default class DOMSpec {
    constructor( content ) {
        this.content = content;
        this.type = typeof content === 'string' ? 'selector' : 'instance';
        this.kind = this.type === 'instance' ? null : Xpath.isXpath( content ) ? 'xpath' : 'css';
        if ( this.kind === 'xpath' ) {
            this.isXpathAttr = Xpath.split( content.trim().slice( 1, -1 ), '@' ).length > 1;
        }
    }
    toString() { return this.content; }
}