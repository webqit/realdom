# DOM

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/dom.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/dom.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

**_Use as an npm package:_**

```bash
npm i @webqit/dom
```

```js
// Import
import init from '@webqit/dom';

// Initialize the lib
init.call( window );

// Obtain the APIs
const { ready, Realtime, Reflow } = window.wq.dom;
```

**_Use as a script:_**

```html
<script src="https://unpkg.com/@webqit/dom/dist/main.js"></script>
```

```js
// Obtain the APIs
const { ready, Realtime, Reflow } = window.wq.dom;
```

## Document-Ready Method

```js
ready( () => {
    console.log();
} );
```

## Realtime

### `Realtime.observe()`

A beautiful abstraction over the awful [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API!

```js
// Capture all elements being added or removed, within the document context
Realtime.observe( document, logMutationRecord, { subtree: true } );
```

```js
// Capture all "p" elements being added or removed, within the document context
Realtime.observe( document, 'p', logMutationRecord, { subtree: true } );
```

```js
// Capture element instances being added or removed, within the document context
const p = document.createElement( 'p' );
Realtime.observe( document, [p], logMutationRecord, { subtree: true } );
document.querySelector( 'div' ).appendChild( p );
```

```js
function logMutationRecord( record ) {
    console.log( record.target, record.addedNodes, record.removedNodes, record.type );
}
```

### `Realtime.intercept()`

An ahead-of-time mutation observer API that intercepts DOM operations before they happen.

```js
// Capture all elements BEFORE they are added or removed, within the document context
Realtime.intercept( document, logInterceptionRecord, { subtree: true } );
```

```js
// Capture all "p" elements BEFORE they are added or removed, within the document context
Realtime.intercept( document, 'p', logInterceptionRecord, { subtree: true } );
```

```js
// Capture element instances BEFORE they are added or removed, within the document context
const p = document.createElement( 'p' );
Realtime.intercept( document, [p], logInterceptionRecord, { subtree: true } );
document.querySelector( 'div' ).appendChild( p );
```

```js
function logInterceptionRecord( record ) {
    console.log( record.target, record.incomingNodes, record.outgoingNodes, record.type );
}
```

## Reflow

Docs Coming Soon.

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/dom/issues).

## License

MIT.
