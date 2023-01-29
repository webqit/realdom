# DOM

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/dom.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/dom" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/dom.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

## Download

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

Know when the document is ready.

```js
ready(() => {
    console.log( 'Document is ready' );
});
```

## Realtime

React to realtime DOM operations.

### Method: `Realtime.attr()`

> `Realtime.attr( context, callback )`

> `Realtime.attr( context, filter, callback )`

A succinct attributes observer API that abstracts the [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API!

```js
// Observe all attributes that have been added or removed to/from the specified context ("div" in this case)
Realtime.observe( div, logMutationRecord );
```

```js
// Observe when the specified attributes are added or removed to/from the specified context ("div" in this case)
Realtime.observe( div, [ 'contenteditable', 'data-state' ], logMutationRecord );
```

```js
function logMutationRecord( record, context ) {
    // Note the record.name and record.oldValue properties
    console.log( record.target, record.name, record.oldValue, record.type === 'attribute-record' );
}
```

### Method: `Realtime.observe()`

> `Realtime.observe( context, callback[, params = {} ])`

> `Realtime.observe( context, filter, callback[, params = {} ])`

A beautiful abstraction over the awful [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API!

```js
// Observe all elements that have been added or removed to/from the specified context (document in this case)
Realtime.observe( document, logMutationRecord, { subtree: true } );
```

```js
// Observe all "p" elements that have been added or removed to/from the specified context (document in this case)
Realtime.observe( document, 'p', logMutationRecord, { subtree: true } );

// "p" elements - whether added from markup and deeply nested (as per { subtree: true })...
document.body.innerHTML = '<div><p></p></div>';

// or added programmatically...
const p = document.createElement( 'p' );
const div = document.createElement( 'div' );
// and deeply nested (as per { subtree: true })
div.appendChild( p );
document.body.appendChild( div );
```

```js
// Observe element instances too (e.g. a "p" instance)...
const p = document.createElement( 'p' );
Realtime.observe( document, [ p, orCssSelector ], logMutationRecord, { subtree: true } );

// for when they've been added or removed to/from the given context (document in this case)...
const div = document.createElement( 'div' );
// and even when deeply nested (as per { subtree: true })
div.appendChild( p );
document.body.appendChild( div );
```

```js
// And now, when having been removed from context...
// either via an overwrite... (indirect overwrite in this case, as per { subtree: true })...
document.body.innerHTML = '';

// or via some programmatic means... (indirect removal in this case, as per { subtree: true })...
document.querySelector( 'div' ).remove();
```

```js
function logMutationRecord( record, context ) {
    // Note the record.addedNodes and record.removedNodes arrays
    console.log( record.target, record.addedNodes, record.removedNodes, record.type === 'mutation-record' );
}
```

### Method: `Realtime.match()`

> `Realtime.match( context, callback[, params = {} ])`

> `Realtime.match( context, filter, callback[, params = {} ])`

A dual-purpose method that both delivers the current matching result and keeps it live by employing `Realtime.observe()` under the hood.

```js
// This becomes an exact alias for Realtime.observe() being that no targets are specified
Realtime.match( document, logMutationRecord, { subtree: true } );
```

```js
// Now, deliver all current "p" elements and keep subsequent mutations to "p" elements coming
Realtime.match( document, 'p', logMutationRecord, { subtree: true } );
```

```js
// Match element instances too (e.g. a "p" instance)...
const p = document.createElement( 'p' );
Realtime.match( document, [ p, orCssSelector ], logMutationRecord, { subtree: true } );
// But "p" doesn't match as a node connected to the context (document in this case)
// and so isn't delivered

// But it's caught by the observer when added to the context
const div = document.createElement( 'div' );
div.appendChild( p );
document.body.appendChild( div );
```

```js
function logMutationRecord( record, context ) {
    // Depending on record.type
    // Note the record.connectedNodes and record.disconnectedNodes arrays
    console.log( record.target, record.connectedNodes, record.disconnectedNodes, record.type === 'query-record' );
    // Note the record.addedNodes and record.removedNodes arrays
    console.log( record.target, record.addedNodes, record.removedNodes, record.type === 'mutation-record' );
}
```

### Method: `Realtime.intercept()`

> `Realtime.intercept( context, callback[, params = {} ])`

> `Realtime.intercept( context, filter, callback[, params = {} ])`

An ahead-of-time mutation observer API that intercepts DOM operations before they happen. This is much like `Realtime.observe()` but with a marked difference: timing! This captures mutations that *are about to happen*, while the former captures mutations that *have just happened*!

> A good usecase is ahead.

```js
// Intercept all elements that are BEING added or removed to/from the specified context (document in this case)
Realtime.intercept( document, logInterceptionRecord, { subtree: true } );
```

```js
// Intercept all "p" elements that are BEING added or removed to/from the specified context (document in this case)
Realtime.intercept( document, 'p', logInterceptionRecord, { subtree: true } );

// "p" elements - whether added from markup and deeply nested (as per { subtree: true })...
document.body.innerHTML = '<div><p></p></div>';

// or added programmatically...
const p = document.createElement( 'p' );
const div = document.createElement( 'div' );
// and deeply nested (as per { subtree: true })
div.appendChild( p );
document.body.appendChild( div );
```

```js
// Intercept element instances too (e.g. a "p" instance)...
const p = document.createElement( 'p' );
Realtime.intercept( document, [ p, orCssSelector ], logInterceptionRecord, { subtree: true } );

// for when they're BEING added or removed to/from the given context (document in this case)...
const div = document.createElement( 'div' );
// and even when deeply nested (as per { subtree: true })
div.appendChild( p );
document.body.appendChild( div );
```

```js
// And now, when BEING removed from context...
// either via an overwrite... (indirect overwrite in this case, as per { subtree: true })...
document.body.innerHTML = '';

// or via some programmatic means... (indirect removal in this case, as per { subtree: true })...
document.querySelector( 'div' ).remove();
```

```js
function logInterceptionRecord( record, context ) {
    // Note the record.incomingNodes and record.outgoingNodes arrays
    console.log( record.target, record.incomingNodes, record.outgoingNodes, record.type === 'interception-record' );
}
```

---------------------------

**_Some niceties_**

+ With each of the three APIs, it is possible to opt in to either just the "connected", "added", "incoming" records or to just the "disconnected", "removed", "outgoing" records. You'd use the `params.on` property:
    + `params.on: 'connected'` - only records for "connected", "added", "incoming" nodes are delivered - with the `match()`, `observe()`, `intercept()` APIs respectively.
    + `params.on: 'disconnected'` - only records for "disconnected", "removed", "outgoing" nodes are delivered - with the `match()`, `observe()`, `intercept()` APIs respectively.

+ With each of the three APIs, omiting the `{ subtree: true }` setting  would mean that deeply nested targets won't be searched for; only directly-mutated nodes will be evaluated.

+ The `Realtime` API is designed for the consistency and predictability that the native `MutationObserver` API lacks for certain usecases.

    For example, bind a mutation observer - with `{subtree: true}` - to the `document` object before page parsing begins, and you'd see that all elements are announced:
    
    ```html
    <html>
        <head>
            <script>
            new MutationObserver( records => {
                // Log mutations and notice that every element in the tree - e.g. <div> and <p> - is caught
            } ).observe( document, { subtree: true } );
            </script>
        </head>
        <body>
            <div>
                <p></p>
            </div>
        </body>
    </html>
    ```
    
    But try adding an equivalent DOM structure programmatically - e.g. `<div><p></p></div>` - and you'd see that nested elements (`p`) aren't caught:
    
    ```js
    const div = document.createElement( 'div' );
    const p = document.createElement( 'p' );
    div.appendChild( p );
    document.body.appendChild( div );
    ```
    
    By contrast, the `Realtime` API is consistent with `{ subtree: true }` in all cases!
    
+ The `Realtime.intercept()` API is designed for the rare possiblity of intercepting elements before they're handled natively by the browser. This lets you build tools that extend the DOM in more low-level ways. For example, you could [intercept and rewrite `<script>` elements](https://github.com/webqit/oohtml#scoped-js) before they're parsed and executed.

**_Some notes_**

+ The `Realtime` API is able to do the extra-ordinary by going a bit extra-ordinary: by literally intercepting DOM APIs. And here is the complete list of them:
    
    + `Node`: `insertBefore`, `replaceChild`, `removeChild`, `appendChild`, `textContent`, `nodeValue`.
    + `Element`: `insertAdjacentElement`, `insertAdjacentHTML`, `setHTML`, `replaceChildren`, `replaceWith`, `remove`. `before`, `after`, `append`, `prepend`.
    + `HTMLElement`: `outerText`, `innerText`.
    
    Point is: monkeying (responsibly) with the DOM for polyfill development is a norm. But you may need to consider this caveat carefully in your specific usecases.

## Reflow

Eliminate layout thrashing by batching DOM read/write operations. (Compare [fastdom](https://github.com/wilsonpage/fastdom))

```js
Reflow.onread( () => {
  console.log( 'reading phase of the UI' );
} );

Reflow.onwrite( () => {
  console.log( 'writing phase of the UI' );
} );

Reflow.onread( () => {
  console.log( 'reading phase of the UI'  );
} );

Reflow.onwrite( () => {
  console.log( 'writing phase of the UI'  );
} );
```

```
reading phase of the UI
reading phase of the UI
writing phase of the UI
writing phase of the UI
```

**_Concept_**

The `Reflow` API works as a regulatory layer between your app/library and the DOM. It lets you think of the DOM in terms of a "reading" phase and a "writing" phase, and lets you hook into this cycle when working with the DOM: `onread()` for doing "read" operations, and `onwrite` for doing "write" operations. Batching DOM operations this way lets us avoid unnecessary document reflows and dramatically speed up layout performance.

> Each read/write operation is added to a corresponding read/write queue. The queues are emptied (reads, then writes) at the turn of the next frame using `window.requestAnimationFrame`.

### Method: `Reflow.onread()`

> `Reflow.onread( onread[, inPromiseMode = false ])`

Schedules a job for the "read" phase. Can return a promise that resolves when job eventually executes; you ask for a promise by supplying `true` as a second argument.

```js
const promise = Reflow .onread( () => {
  const width = element.clientWidth;
}, true/*give back a promise*/ );
```

### Method: `Reflow.onwrite()`

> `Reflow.onwrite( onwrite[, inPromiseMode = false ])`

Schedules a job for the "write" phase. Can return a promise that resolves when job eventually executes; you ask for a promise by supplying `true` as a second argument.

```js
const promise = Reflow .onwrite( () => {
  element.style.width = width + 'px';
}, true/*give back a promise*/ );
```

### Method: `Reflow.cycle()`

> `Reflow.cycle( onread, onwrite )`

Puts your read/write operations in a cycle that keeps in sync with the UI's read/write phases.

```js
Reflow.cycle(
    // onread
    () => {
        // Do a read operation
        const width = element.clientWidth;
        // Now if we return anything other than undefined, the "onwrite" block is executed
        return width; // recieved by the "onwrite" callback on its first parameter
    },
    // onwrite
    ( width, carried ) => {
        // Do a write operation
        element.style.width = width + 'px';
        // Now if we return anything other than undefined, the cycle repeats starting with the "onread" block
        return newCarry; // recieved by the "onwrite" block again on its second parameter: "carried"
    }
);
```

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/dom/issues).

## License

MIT.
