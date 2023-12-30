
/**
 * @imports
 */
import * as Util from './Util.js';

export default class DOMSpec {
    constructor( content ) {
        this.content = content;
        this.type = typeof content === 'string' ? 'selector' : 'instance';
        this.kind = this.type === 'instance' ? null : Util.isXpath( content ) ? 'xpath' : 'css';
        if ( this.kind === 'xpath' ) {
            this.isXpathAttr = Util.splitOuter( content.trim().slice( 1, -1 ), '@' ).length > 1;
        }
    }
    toString() { return this.content; }
}