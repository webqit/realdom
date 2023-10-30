

export function isXpath( expr ) { return ( expr = expr.trim() ) && expr.startsWith( '(' ) && expr.endsWith( ')' ) }

export function query( window, context, expr, isUnioned = false ) {
    expr = ( isUnioned ? split( expr ) : [ expr ] ).map( x => x.replace( '(', '(.//' ) ).join( '|' );
    const result = window.document.evaluate( expr, context, null, XPathResult.ANY_TYPE );
    let nodes = [], node;
    while ( node = result.iterateNext() ) nodes.push( node );
    return nodes;
}

export function match( window, node, expr, isUnioned = false ) {
    expr = ( isUnioned ? split( expr ) : [ expr ] ).map( x => x.replace( '(', '(self::' ) ).join( '|' );
    return window.document.evaluate( `${ expr }`, node, null, XPathResult.BOOLEAN_TYPE ).booleanValue;
}

function split( s ) {
    return [ ...s ].reduce( ( [ state, splits ], x ) => {
        if ( x === '|' && state === 0 ) return [ state, [ '' ].concat( splits ) ];
        if ( x === '(' && !splits[ 0 ].endsWith( '\\' ) ) state++;
        if ( x === ')' && !splits[ 0 ].endsWith( '\\' ) ) state--;
        splits[ 0 ] += x;
        return [ state, splits ]
    }, [ 0, [ '' ] ] )[ 1 ].reverse();
}
