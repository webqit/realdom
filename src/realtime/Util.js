

export function isXpath( expr ) { return ( expr = expr.trim() ) && expr.startsWith( '(' ) && expr.endsWith( ')' ) }

export function xpathQuery( window, context, expr, subtree = true ) {
    expr = ( Array.isArray( expr ) ? expr : [ expr ] ).map( x => ( x + '' ).replace( '(', subtree ? '(.//' : '(./' ) ).join( '|' );
    let nodes = [], node;
    try {
        // Throws in firefox and safari where context is a text node
        const result = window.document.evaluate( expr, context, null, window.XPathResult.ANY_TYPE );
        while ( node = result.iterateNext() ) nodes.push( node );
    } catch( e ) {}
    return nodes;
}

export function xpathMatch( window, node, expr ) {
    expr = ( Array.isArray( expr ) ? expr : [ expr ] ).map( x => ( x + '' ).replace( '(', '(self::' ) ).join( '|' );
    try {
        // Throws in firefox and safari where context is a text node and query isn't
        return window.document.evaluate( `${ expr }`, node, null, window.XPathResult.BOOLEAN_TYPE ).booleanValue;
    } catch( e ) {}
}

export function containsNode( window, a, b, crossRoots = false, testCache = null ) {
    const prevTest = testCache?.get( a )?.get( b );
    if ( typeof prevTest !== 'undefined' ) return prevTest;
    const response = val => {
        if ( !testCache?.has( a ) ) testCache?.set( a, new WeakMap );
        testCache?.get( a )?.set( b, val );
        return val;
    };
    const rootNodeA = a.getRootNode();
    const rootNodeB = b.getRootNode();
    if ( rootNodeA === rootNodeB ) return response( a.contains( b ) );
    if ( crossRoots && rootNodeB instanceof window.ShadowRoot ) return response( containsNode( window, a, rootNodeB.host, crossRoots, testCache ) );
    return response( false );
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