

export function isXpath( expr ) { return ( expr = expr.trim() ) && expr.startsWith( '(' ) && expr.endsWith( ')' ) }

export function query( window, context, expr, isUnioned = false ) {
    expr = expr.replace( '(', '(.//' );
    const result = window.document.evaluate( expr, context, null, XPathResult.ANY_TYPE );
    let nodes = [], node;
    while ( node = result.iterateNext() ) nodes.push( node );
    return nodes;
}

export function match( window, node, expr, isUnioned = false ) {
    expr = expr.replace( '(', '(self::' );
    return window.document.evaluate( `${ expr }`, node, null, XPathResult.BOOLEAN_TYPE ).booleanValue;
}
