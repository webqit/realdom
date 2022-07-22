# DOM

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/dom.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/dom.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

```bash
npm i @webqit/dom
```

```js
import init from '@webqit/dom';

init.call( window );
```

## Static Query Methods

```js
const q = window.wq.dom;
```

### `q.querySelectorAll()`

```js
// Get all "p" elements, returning an array, but instance of q.constructor
const pElements = q.querySelectorAll( 'p' );
console.log( pElements ); // Query(2)
```

### `q.children()`

```js
// Get all children, returning an array, but instance of q.constructor
const children = pElements.children();
console.log( children ); // Query(2)
```

### `q.attributes()`

```js
// Get all attributes, returning an array
const attrs = pElements.attributes();
console.log( attrs ); // [ { name, value }, { name, value } ]
```

```js
// Get attributes by name, returning an array of values
const attrs = pElements.attributes( [ name1, name2 ] );
console.log( attrs ); // [ value1, value2 ]
```

## Realtime Query Methods

```js
const r = pElements.realtime(); // Or q.realtime( pElements ); Or q.realtime( 'p' );
```

### `r.querySelectorAll()`

```js
// Get all "span" elements each, and in realtime
let observer = r.querySelectorAll( 'span', spanElement => {
    // Each existing descendant "span is immediately logged
    console.log( spanElement ); // HTMLElement
} );
```

```js
const addSpan = () => pElements[ 0 ].appendChild( document.createElement( 'span' ) );
```

```js
// This new "span" is captured
setTimeout( addSpan, 1000 );
```

```js
// This new "span" is NOT captured
setTimeout( () => {
    observer = observer.disconnect();
    addSpan();
}, 2000 );
```

```js
// This new "span" is captured
setTimeout( () => {
    observer = observer.reconnect();
    addSpan();
}, 3000 );
```

### `r.querySelectorNone()`

```js
// Run when none of the matched elements are present in the DOM
// Or when a previously present one leaves the DOM
let observer = r.querySelectorNone( 'span', spanElement => {
    // If no "span" elements, we're called immediately, and spanElement is null
    // If an existing spanElement is removed from DOM, we're called
    console.log( spanElement?.isConnected ); // false
} );
```

```js
const removeSpan = () => pElements[ 0 ].querySelector( 'span' ).remove();
```

```js
// This new "span" removal is captured
setTimeout( removeSpan, 1000 );
```

```js
// This new "span" removal is NOT captured
setTimeout( () => {
    observer = observer.disconnect();
    removeSpan();
}, 2000 );
```

```js
// This new "span" removal is captured
setTimeout( () => {
    observer = observer.reconnect();
    removeSpan();
}, 3000 );
```

### `r.children()`

```js
// Get all children each, and in realtime
let observer = r.children( childElement => {
    // Each existing child is immediately logged
    console.log( childElement ); // HTMLElement
} );
```

```js
const addChild = () => pElements[ 0 ].appendChild( document.createElement( 'b' ) );
```

```js
// This new child is captured
setTimeout( addChild, 1000 );
```

```js
// This new child is NOT captured
setTimeout( () => {
    observer = observer.disconnect();
    addChild();
}, 2000 );
```

```js
// This new child is captured
setTimeout( () => {
    observer = observer.reconnect();
    addChild();
}, 3000 );
```

### `r.attributes()`

```js
// Get all attributes each, and in realtime
let observer = r.attributes( ( { name, value } ) => {
    // Each existing attribute is immediately logged
    console.log( name, value );
} );
```

```js
// Get attributes by name, and in realtime
let observer = r.attributes( [ name1, name2 ], ( value1, value2 ) => {
    // Each existing attribute is immediately logged
    console.log( value1, value2 );
} );
```

```js
const addAttr = () => pElements[ 0 ].setAttribute( 'name', 'value' );
```

```js
// This new attribute is captured
setTimeout( addAttr, 1000 );
```

```js
// This new attribute is NOT captured
setTimeout( () => {
    observer = observer.disconnect();
    addAttr();
}, 2000 );
```

```js
// This new attribute is captured
setTimeout( () => {
    observer = observer.reconnect();
    addAttr();
}, 3000 );
```

## Observe-Only Query Methods

### `r.connectedCallback()`

```js
// Equivalent to r.querySelectorAll() but only for new additions
```

```js
// Also takes an existing element
q.realtime( document.querySelector( 'p' ) ).connectedCallback( pElement  => {
} );
```

```js
// Also takes multiple existing elements
q.realtime( document.querySelectorAll( 'p' ) ).connectedCallback( ( pElement, connectedFlag, connectedFlagNow, totalCoonected, totalDiscoonected )  => {
}, { maintainCallState: true /* to receive totalCoonected and totalDiscoonected */ } );
```

### `r.disconnectedCallback()`

```js
// Equivalent to r.querySelectorNone() but only for new removal
```

```js
// Also takes an existing element
q.realtime( document.querySelector( 'p' ) ).disconnectedCallback( pElement  => {
} );
```

```js
// Also takes multiple existing elements
q.realtime( document.querySelectorAll( 'p' ) ).disconnectedCallback( ( pElement, connectedFlag, connectedFlagNow, totalCoonected, totalDiscoonected )  => {
}, { maintainCallState: true /* to receive totalCoonected and totalDiscoonected */ } );
```

### `r.presenceChangeCallback()`

```js
// Equivalent to r.connectedCallback() + r.disconnectedCallback()
```

### `r.attributeChangeCallback()`

```js
// Equivalent to r.attributes(), but only on new mutations
```

## Documentation

Coming Soon.

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/dom/issues).

## License

MIT.
