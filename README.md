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

Know when the document is ready.

```js
ready( () => {
    console.log();
} );
```

## Realtime

React to realtime DOM operations.

### `Realtime.observe()`

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
//  and deeply nested (as per { subtree: true })
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
function logMutationRecord( record ) {
    console.log( record.target, record.addedNodes, record.removedNodes, record.type );
}
```

### `Realtime.intercept()`

An ahead-of-time mutation observer API that intercepts DOM operations before they happen. This is much like `Realtime.observe()` but with a remarkable difference: timing! This captures mutations that *are about to happen*, while the former captures mutations that *have just happened*!

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
//  and deeply nested (as per { subtree: true })
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
function logInterceptionRecord( record ) {
    // Note the record.incomingNodes and record.outgoingNodes arrays
    console.log( record.target, record.incomingNodes, record.outgoingNodes, record.type );
}
```

### *Some niceties*

+ The `Realtime` API is designed for the consistency and predictability that the native `MutationObserver` API lacks for certain usecases.

    For example, bind a mutation observer - with `{subtree: true}` - to the `document` object before page parsing begins, and all elements are announced:
    
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
    
    But programmatically add an equivalent DOM structures - e.g. `<div><p></p></div>` - and nested elements (`p`) aren't caught:
    
    ```js
    const div = document.createElement( 'div' );
    const p = document.createElement( 'p' );
    div.appendChild( p );
    document.body.appendChild( div );
    ```
    
    By contrast, the `Realtime` API is consistent with `{ subtree: true }` whatever the case!
    
+ The `Realtime.intercept()` API is designed for the rare possiblity of intercepting elements before they're handled natively by the browser. This lets you build tools that extend the DOM in more low-level ways. For example, you could [intercept and rewrite `<script>` elements](https://github.com/webqit/oohtml#scoped-js) before they're parsed and executed.

### *Some notes*

+ The `Realtime` API is able to do the extra-ordinary by going a bit extra-ordinary: by literally intercepting DOM APIs. And here are the complete list of them:
    
    + `Node`: `insertBefore`, `replaceChild`, `removeChild`, `appendChild`, `textContent`, `nodeValue`.
    + `Element`: `insertAdjacentElement`, `insertAdjacentHTML`, `setHTML`, `replaceChildren`, `replaceWith`, `remove`. `before`, `after`, `append`, `prepend`.
    + `HTMLElement`: `outerText`, `innerText`.
    
    (Responsibly) Monkeying with the DOM for polyfill development is a norm. But you may need to consider this caveat carefully in your specific usecases.

## Reflow

liminate layout thrashing by batching DOM read/write operations. (Compare [fastdom](https://github.com/wilsonpage/fastdom))

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/dom/issues).

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

### *Concept*

The `Reflow` API works as a regulatory layer between your app/library and the DOM. It lets you think of the DOM in terms of a "reading" phase and a "writing" phase, and lets you hook into this cycle when working with the DOM: `onread()` for doing "read" operations, and `onwrite` for doing "write" operations. Batching DOM operations this way lets us avoid unnecessary document reflows and dramatically speed up layout performance.

> Each read/write operation is added to a corresponding read/write queue. The queues are emptied (reads, then writes) at the turn of the next frame using `window.requestAnimationFrame`.

### `Reflow.onread()`

Schedules a job for the "read" phase. Can return a promise that resolves when eventually executed; you ask for a promise by giving `true` as a second argument.

```js
const promise = Reflow .onread( () => {
  const width = element.clientWidth;
}, true/*give back a promise*/ );
```

### `Reflow.onwrite()`

Schedules a job for the "write" phase. Can return a promise that resolves when eventually executed; you ask for a promise by giving `true` as a second argument.

```js
const promise = Reflow .onwrite( () => {
  element.style.width = width + 'px';
}, true/*give back a promise*/ );
```

### `Reflow.cycle()`

Puts your read/write operations in a cycle that keeps in sync with your UI's read/write phases.

> `Reflow.cycle( onread, onwrite )`

```js
Reflow.cycle(
    () => {
        const width = element.clientWidth;
        // if we return anything other than undefined, the "onwrite" callback is called
        return width; // recieved by the "onwrite" callback on its first parameter
    },
    ( width, carried ) => {
        element.style.width = width + 'px';
        // if we return anything other than undefined, the cycle repeats
        return newCarry; // recieved by the "onwrite" callback again on its second parameter: "carried"
    }
);
```

## License

MIT.
