

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

export function split( s, delim = '|' ) {
    return [ ...s ].reduce( ( [ state, splits ], x ) => {
        if ( x === delim && state === 0 ) return [ state, [ '' ].concat( splits ) ];
        if ( [ '(', '[' ].includes( x ) && !splits[ 0 ].endsWith( '\\' ) ) state++;
        if ( [ ')', ']' ].includes( x ) && !splits[ 0 ].endsWith( '\\' ) ) state--;
        splits[ 0 ] += x;
        return [ state, splits ]
    }, [ 0, [ '' ] ] )[ 1 ].reverse();
}
