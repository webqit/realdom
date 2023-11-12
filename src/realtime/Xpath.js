

export function isXpath( expr ) { return ( expr = expr.trim() ) && expr.startsWith( '(' ) && expr.endsWith( ')' ) }

export function query( window, context, expr, subtree = true ) {
    expr = ( Array.isArray( expr ) ? expr : [ expr ] ).map( x => ( x + '' ).replace( '(', subtree ? '(.//' : '(./' ) ).join( '|' );
    const result = window.document.evaluate( expr, context, null, XPathResult.ANY_TYPE );
    let nodes = [], node;
    while ( node = result.iterateNext() ) nodes.push( node );
    return nodes;
}

export function match( window, node, expr ) {
    expr = ( Array.isArray( expr ) ? expr : [ expr ] ).map( x => ( x + '' ).replace( '(', '(self::' ) ).join( '|' );
    return window.document.evaluate( `${ expr }`, node, null, XPathResult.BOOLEAN_TYPE ).booleanValue;
}

export function splitOuter( str, delim = '|' ) {
    return [ ...str ].reduce( ( [ quote, depth, splits, skip ], x ) => {
        if ( !quote && depth === 0 && ( Array.isArray( delim ) ? delim : [ delim ] ).includes( x ) ) {
            return [ quote, depth, [ '' ].concat( splits ) ];
        }
        if ( !quote && [ '(', '[', '{' ].includes( x ) && !splits[ 0 ].endsWith( '\\' ) ) depth++;
        if ( !quote && [ ')', ']', '}' ].includes( x ) && !splits[ 0 ].endsWith( '\\' ) ) depth--;
        if ( [ '"', "'", '`' ].includes( x ) && !splits[ 0 ].endsWith( '\\' ) ) {
            quote = quote === x ? null : ( quote || x );
        }
        splits[ 0 ] += x;
        return [ quote, depth, splits ]
    }, [ null, 0, [ '' ] ] )[ 2 ].reverse();
}