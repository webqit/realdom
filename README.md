# realdom

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

A small, low-level utility for working with the (real) DOM in realtime!

## Documentation

> **Info** This is *(Early stage)* documentation for `v2.x`. (Looking for [`v1.x`](https://github.com/webqit/realdom/tree/v1.0.3)?)

+ [Download Options](#download-options)
+ [The Ready-State API](#the-ready-state-api)
  + [Method: `realdom.ready()`](#method-realdomready)
+ [The Realtime Mutations API](#the-realtime-mutations-api)
  + [Method: `realdom.realtime( context ).observe()`](#method-realdomrealtime-context-observe)
    + [Concept: *Scope*](#concept-scope)
    + [Concept: *Targets*](#concept-targets)
    + [Concept: *Records*](#concept-records)
    + [Concept: *Static Sensitivity*](#concept-static-sensitivity)
    + [Concept: *Event Details*](#concept-event-details)
    + [Concept: *Abort Signals*](#concept-abort-signals)
    + [Concept: *Life Cycle Signals*](#concept-life-cycle-signals)
    + [Concept: *Timing*](#concept-timing)
  + [Method: `realdom.realtime( context ).query()`](#method-realdomrealtime-context-query)
    + [Concept: *Scope*](#concept-scope-1)
    + [Concept: *Targets*](#concept-targets-1)
    + [Concept: *Records*](#concept-records-1)
    + [Concept: *Realtime Queries*](#concept-realtime-queries)
  + [Method: `realdom.realtime( context, 'attr' ).observe()`](#method-realdomrealtime-context-attr-observe)
    + [Concept: *Scope*](#concept-scope-2)
    + [Concept: *Targets*](#concept-targets-2)
    + [Concept: *Records*](#concept-records-2)
    + [Concept: *Atomic Delivery*](#concept-atomic-delivery)
    + [Concept: *Event Details*](#concept-event-details-1)
    + [Concept: *Abort Signals*](#concept-abort-signals-1)
    + [Concept: *Life Cycle Signals*](#concept-life-cycle-signals-1)
    + [Concept: *Timing*](#concept-timing-1)
  + [Method: `realdom.realtime( context, 'attr' ).get()`](#method-realdomrealtime-context-attr-get)
    + [Concept: *Scope*](#concept-scope-3)
    + [Concept: *Targets*](#concept-targets-3)
    + [Concept: *Realtime Attributes*](#concept-realtime-attributes)
  + [Method: `realdom.realtime( context ).attr()`](#method-realdomrealtime-context-attr)
  + [Implementation Notes](#implementation-notes)
+ [The Render Scheduling API](#the-render-scheduling-api)
  + [Method: `realdom.schedule( 'read', ... )`](#method-realdomschedule-read--)
  + [Method: `realdom.schedule( 'write', ... )`](#method-realdomschedule-write--)
  + [Method: `realdom.schedule( 'cycle', ... )`](#method-realdomschedule-cycle--)
+ [Issues](#issues)
+ [License](#license)

## Download Options

**_Use as an npm package:_**

```bash
npm i @webqit/realdom
```

```js
// Import
import init from '@webqit/realdom';

// Initialize the lib
init.call( window );

// Obtain the APIs
const { ready, realtime, schedule } = window.webqit.realdom;
```

**_Use as a script:_**

```html
<script src="https://unpkg.com/@webqit/realdom/dist/main.js"></script>
```

```js
// Obtain the APIs
const { ready, realtime, schedule } = window.webqit.realdom;
```

## The Ready-State API

Know when the document is ready! This is a simplistic API for working with the document's [ready state](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState).

### Method: `realdom.ready()`

Know when the document is ready.

```js
// Signature 1
ready([ callback = undefined ]);
```

```js
// Signature 2
ready([ timing = 'interactive'[, callback = undefined ]]);
```

The `ready()` function takes a callback function to be called at a certain document-ready state. This function receives the `window` object.

```js
// Binding to the document's ready state
ready( window => console.log( `Document "ready state" is now "interactive"` ) );
```

*When no callback function is provided, a promise is returned.*

```js
// Awaiting the document's ready state
await ready();
console.log( `Document "ready state" is now "interactive"` );
```

**-->** Use the two-parameter syntax to specify the `timing` - i.e. *[ready state](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState)* - at which to be called. This can be either of two values:

+ `interactive` - *(The default)* The point at which the document has finished loading and the document has been parsed but sub-resources such as scripts, images, stylesheets and frames are still loading.

+ `complete` - The point at which the document and all sub-resources have finished loading.

```js
// Binding to the document's "complete" ready state
ready( 'complete', () => console.log( 'Document "ready state" is now "complete"' ) );
```

```js
// Awaiting the document's "complete" ready state
await ready( 'complete' );
console.log( `Document "ready state" is now "complete"` );
```

## The Realtime Mutations API

React to realtime DOM operations! This is a set of succint and consistent methods for accessing the DOM - either on-demand (you calling the DOM... as you would using [`querySelectorAll()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)) or in realtime (you letting the DOM call you... as you would using the [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API).

### Method: `realdom.realtime( context ).observe()`

Observe the (real) DOM in realtime!

```js
// Signature 1
realtime( context ).observe( callback[, options = {} ]);
```

```js
// Signature 2
realtime( context ).observe( targets, callback[, options = {} ]);
```

### Concept: *Scope*

Report all *direct children* additions and removals to/from the given element - the context:

```js
// Observing all direct children mutations
realtime( document.body ).observe( handleChanges );
```

**-->** Observe entire *subtree* of the given element using the `options.subtree` flag:

```js
// Observing all subtree mutations
realtime( document.body ).observe( handleChanges, { subtree: true } );
```

> **Info** You'd normally always need this flag when the `document` object is the *context*.

### Concept: *Targets*

Report all "p" elements that have been added or removed to/from the given context:

```js
// Observing only "p" elements mutations
realtime( document.body ).observe( 'p', handleChanges, { subtree: true } );
```

...whether "p" elements added via markup:

```js
// and whether or not it's deeply nested as par { subtree: true }:
document.body.innerHTML = '<div><p></p></div>';
```

...or "p" elements added programmatically:

```js
// and whether or not it's deeply nested as par { subtree: true }:
const p = document.createElement( 'p' );
const div = document.createElement( 'div' );
div.appendChild( p );
document.body.appendChild( div );
```

**-->** Observe element instances as targets too. (E.g. a "p" instance.)

```js
// observing an instance plus a selector
const pElement = document.createElement( 'p' );
realtime( document.body ).observe( [ pElement, orCssSelector ], handleChanges, { subtree: true } );
```

...both for when they're added:

```js
// and whether or not it's deeply nested as par { subtree: true }:
const div = document.createElement( 'div' );
div.appendChild( pElement );
document.body.appendChild( div );
```

...and when they're removed:

```js
// either via an overwrite... (indirect overwrite in this case)...
document.body.innerHTML = '';
```

```js
// or via some programmatic means... (indirect removal in this case)...
document.querySelector( 'div' ).remove();
```

### Concept: *Records*

Handle mutation records - each having an `entrants` and an `exits` array property, representing added and removed nodes respectively:

```js
// Handling changes
function handleChanges( record ) {
    for ( const addedNode of record.entrants ) {
        console.log( 'added:', addedNode );
    }
    for ( const removedNode of record.exits ) {
        console.log( 'removed:', removedNode );
    }
}
```

**-->** Use the `options.generation` parameter to require only either the `entrants` or `exits` list:

```js
// Requiring only the "entrants" list
realtime( document.body ).observe( handleChanges, { generation: 'entrants' } );
```

```js
// Handling just record.entrants
function handleChanges( record, context ) {
    for ( const addedNode of record.entrants ) {
        console.log( 'added:', addedNode );
    }
    console.log( record.exits ); // Empty array
}
```

**-->** Use the `record.target` property to access the *mutation target* - often, the parent element under which mutation happened:

```js
// Inspecting record.target
function handleChanges( record ) {
    console.log( record.target ); // HTMLBodyElement
}
```

### Concept: *Static Sensitivity*

When targeting elements using *attribute selectors*, use the `options.staticSensitivity` flag to opt in to statically matching elements based on the attributes mentioned in the selector:

```js
// Adding the options.staticSensitivity flag
realtime( document.body ).observe( 'p[draggable="true"]', handleChanges, { staticSensitivity: true } );
```

*Now, "p" elements are matched for `[draggable="true"]` in their static state too:*

```js
// The following "p" element suddenly matches and is reported (record.entrants)
document.querySelector( 'p' ).setAttribute( 'draggable', 'true' );
```

```js
// The following "p" element suddenly doesn't match and is reported (record.exits)
document.querySelector( 'p' ).setAttribute( 'draggable', 'false' );
```

### Concept: *Event Details*

Use the `option.eventDetails` flag to require the actual DOM operation that happened under the hood:

```js
// Requiring that event details be added
realtime( document.body ).observe( 'p[draggable="true"]', handleChanges, { eventDetails: true } );
```

```js
// Inspecting record.event
function handleChanges( record ) {
    console.log( record.event );
}
```

*You get an array in the format: `[ HTMLBodyElement, 'appendChild' ]` - for mutations that happen programatically:*

```js
// Running an operation
document.body.appendChild( pElement );
```

*You get the keyword: `parse` - for elements recorded directly from the HTML parser while the document loads. (This happens for mutation listeners created early in the document tree.):*

```html
<html>
  <head>
    <script>
      realdom.realtime( document ).observe( 'meta[foo]', handleChanges, { subtree: true } );
    </script>
    <meta name="foo" content="bar">
    <!--
    At this point in the document parsing, the meta element is now reported, and record.event is: "parse"
    -->
    <script>
      const meta2 = document.createElement( 'meta' );
      meta2.name = 'foo';
      meta2.content = 'baz';
      document.head.appendChild( meta2 );
    </script>
    <!--
    At this point in the document parsing, the meta2 element is now reported, and record.event is: [ HTMLHeadElement, 'appendChild' ]
    -->
  </head>
</html>
```

*You get the keyword: `mutation` - for mutations that happen in other ways; e.g in when the user directly alters the DOM tree from the browser console.*

### Concept: *Abort Signals*

Pass in an [Abort Signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort your mutation listener at any time:

```js
// Providing an AbortSignal
const abortController = new AbortController;
realtime( document.body ).observe( 'p', handleChanges, { signal: abortController.signal } );
```

```js
// Abort at any time
abortController.abort();
```

### Concept: *Life Cycle Signals*

When dealing with nested event listeners - event handlers that themselves create event listeners, tying child listeners' lifecycle to parent's lifecycle can be cumbersome.

```js
// Managing nested lifecycles using multiple AbortSignals
const parentAbortController = new AbortController;
let recursionAbortController;
realtime( document.body ).observe( 'p', record => {
    // Abort all nested listeners in "previous" recursion
    recursionAbortController?.abort();
    // Create a new AbortController for listeners in "this" recursion
    recursionAbortController = new AbortController;
    for( const addedNode of record.entrants ) {
        addedNode.addEventListener( 'click', handleClick, { signal: recursionAbortController.signal } );
    }
}, { signal: parentAbortController.signal } );
```

```js
// Abort parent at any time
parentAbortController.abort();
// Abort the latest instance of recursionAbortController
recursionAbortController?.abort();
```

**-->** Use the `options.lifecycleSignals` parameter to opt in to receiving auto-generated signals for tying nested listeners:

```js
// Managing nested lifecycles using automatic lifecycle signals
const parentAbortController = new AbortController;
realtime( document.body ).observe( 'p', ( record, flags ) => {
    for( const addedNode of record.entrants ) {
        addedNode.addEventListener( 'click', handleClick, { signal: flags.signal } );
    }
}, { signal: parentAbortController.signal, lifecycleSignals: true } );
```

```js
// Abort parent at any time
parentAbortController.abort();
// The latest flags.signal instance is also automatically aborted
```

### Concept: *Timing*

For when timing is everything, meet the `options.timing` parameter!

*By default, mutation records are delivered at the "async" timing of the [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API. This means that there's a small lag between when mutations happen and when they are delivered.*

```js
// Observing with "asynchronous" timing
let deliveredElement;
realtime( document.body ).observe( 'p', record => {
    deliveredElement = record.entrants[ 0 ];
} );
```

```js
// Confirming the "async" delivery
const pElement = document.createElement( 'p' );
document.body.appendChild( pElement );
console.log( pElement.isConnected ); // true
console.log( deliveredElement ); // undefined
```

```js
// Estimating delivery timing
setTimeout( () => {
    console.log( deliveredElement ); // HTMLParagraphElement
}, 0 );
```

**-->** Use the `options.timing = "sync"` parameter to observe mutations *synchronously*:

```js
// Opting in to "synchronous" timing
let deliveredElement;
realtime( document.body ).observe( 'p', record => {
    deliveredElement = record.entrants[ 0 ];
}, { timing: 'sync' } );
```

```js
// Confirming the "sync" delivery
const pElement = document.createElement( 'p' );
document.body.appendChild( pElement );
console.log( pElement.isConnected ); // true
console.log( deliveredElement ); // HTMLParagraphElement
```

*There is also a rare case where a tool needs to extend the DOM in more low-level ways, and this time, needs to *intercept* certain mutations before they actually happen. For example, you could only really [rewrite `<script>` elements](https://github.com/webqit/oohtml#scoped-js) before they're parsed and executed if you could *intercept* them.*

**-->** Use the `options.timing = "intercept"` parameter to observe mutations *before* they actually happen:

```js
// Trying the "intercept" timing
realtime( document.body ).observe( 'script', handleScripts, { timing: 'intercept' } );
```

```js
// Making the mutation
const scriptElement = document.createElement( 'script' );
document.body.appendChild( scriptElement );
```

```js
// Confirming the "intercpted" delivery
function handleScripts( record ) {
    const deliveredElement = record.entrants[ 0 ];
    // We're receiving an element that is only just about to be added to the DOM
    console.log( deliveredElement.isConnected ); // false
    console.log( deliveredElement.parentNode ); // null
    console.log( record.event ); // [ HTMLBodyElement, 'appendChild' ]
    // We can rewrite this script
    deliveredElement.text = 'alert( "Tada!" )';
}
```

*And thanks to the [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) API, interception also works at parse time for mutation listeners created early enough:*

```html
<html>
  <head>
    <script>
      realdom.realtime( document ).observe( 'script[rewriteme]', handleScripts, { timing: 'intercept' } );
    </script>
    <script rewriteme>
        alert( 'Hello world!' );
    </script>
    <!--
    At this point in the document parsing, the script[rewriteme] element is now reported, and rewritten
    But note that this time, element was just already in the DOM, only yet to be handled. So...
    console.log( deliveredElement.isConnected ); // true
    console.log( deliveredElement.parentNode ); // HTMLHeadElement
    console.log( record.event ); // "parse"
    -->
  </head>
</html>
```

### Method: `realdom.realtime( context ).query()`

Work with the (real) DOM both on-demand (as you would with [`querySelectorAll()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)), and in *realtime* (as you would with `realtime().observe()`).

```js
// Signature 1
realtime( context ).query([ callback = undefined[, options = {} ]]);
```

```js
// Signature 2
realtime( context ).query( targets[, callback = undefined[, options = {} ]]);
```

```js
// Signature 3
const records = realtime( context ).query([ options = {} ]);
```

### Concept: *Scope*

Get all *direct children* of the given element delivered:

```js
// Getting all children delivered to a callback
realtime( document.body ).query( handleResult );
```

```js
// Retreiving all children
const records = realtime( document.body ).query();
// Deligating to handler
records.forEach( record => handleResult( record ) );
```

**-->** Use the `realtime().children()` alias:

```js
// Delivering, using the .children() alias
realtime( document.body ).children( handleResult );
```

```js
// Retreiving, using the .children() alias
const records = realtime( document.body ).children();
// Deligating to handler
records.forEach( record => handleResult( record ) );
```

> **Info** Using the `options.subtree` flag without specifying *targets* produces no result.

### Concept: *Targets*

Get all "p" elements that are direct children of the given context delivered:

```js
// Matching just "p" children
realtime( document.body ).query( 'p', handleResult );
```

```js
// Using the .children() alias
realtime( document.body ).children( 'p', handleResult );
```

```js
// Retreiving, using the .children() alias
const records = realtime( document.body ).children( 'p' );
// Deligating to handler
records.forEach( record => handleResult( record ) );
```

**-->** Use the `options.subtree` flag to query the entire subtree.

```js
// Using the options.subtree flag
realtime( document.body ).query( 'p', handleResult, { subtree: true } );
```

**-->** Use the `realtime().subtree()` alias:

```js
// Using the .subtree() alias
realtime( document.body ).subtree( 'p', handleResult );
```

```js
// Retreiving, using the .subtree() alias
const records = realtime( document.body ).subtree( 'p' );
// Deligating to handler
records.forEach( record => handleResult( record ) );
```

### Concept: *Records*

Handle query result records in the same way as mutation records:

```js
// Handling query result
function handleResult( record ) {
    // record.entrants is the list of matched nodes
    for ( const matchedNode of record.entrants ) {
        console.log( 'matched:', matchedNode );
    }
    console.log( record.exits ); // Always an empty array
    console.log( record.event ); // Always the keyword: "query"
}
```

> **Info** Setting the `options.generation` parameter to `exits` effectively defies the logic, thus no query actually happens.

**-->** Use the `record.target` property to access the *query context* for the record:

```js
// Inspecting record.target
function handleResult( record ) {
    console.log( record.target ); // HTMLBodyElement
}
```

> **Info** Elements are organized into records by common parent. Thus, an expression like `realtime().subtree( 'p' )` on the below will produce 2 records, with 2 entrants per record:
>
>  ```html
>  <html>
>    <body>
>      <section>
>        <p></p>
>        <p></p>
>      </section>
>      <p></p>
>      <p></p>
>    </body>
>  </html>
>  ```

### Concept: *Realtime Queries*

Get both current and future elements delivered to the same handler function:

```js
// Matching all current "p[draggable]" elements
realtime( document ).query( 'p[draggable]', handleDraggables, { subtree: true } );
// Subscribe to future matching elements
realtime( document ).observe( 'p[draggable]', handleDraggables, { subtree: true } );
```

**-->** Use the `options.live` flag to achieve the same:

```js
// Matching all current "p[draggable]" elements and staying subscribed
realtime( document ).query( 'p[draggable]', handleDraggables, { subtree: true, live: true } );
```

**-->** Use equivalent APIs the same way:

```js
// Using the .subtree() alias
realtime( document ).subtree( 'p[draggable]', handleDraggables, { live: true } );
```

```js
// Using the .children() alias
realtime( document ).children( 'p[draggable]', handleDraggables, { live: true } );
```

**-->** Use the `options.live` flag in conjunction with other concepts:

```js
// Using the options.live flag
const abortController = new AbortController;
realtime( document ).children( 'p[draggable]', handleDraggables, {
    live: true,
    signal: abortController.signal,
    lifecycleSignals: true,
    staticSensitivity: true,
    timing: 'sync',
    eventDetails: true,
} );
```

### Method: `realdom.realtime( context, 'attr' ).observe()`

Observe DOM attributes in realtime!

```js
// Signature 1
realtime( context, 'attr' ).observe( callback[, options = {} ]);
```

```js
// Signature 2
realtime( context, 'attr' ).observe( targets, callback[, options = {} ]);
```

### Concept: *Scope*

Report all attribute changes on the given element:

```js
// Observing all attributes
realtime( document.body, 'attr' ).observe( handleChanges );
```

**-->** Observe all attribute changes across the entire *subtree* of the given context using the `options.subtree` flag:

```js
// Observing entire subtree
realtime( document.body, 'attr' ).observe( handleChanges, { subtree: true } );
```

> **Info** You'd normally always need this flag when the `document` object is the *context*.

### Concept: *Targets*

Observe specific attributes on the given context:

```js
// Observing the "draggable" attribute
realtime( element, 'attr' ).observe( [ 'draggable' ], handleChanges );
```

### Concept: *Records*

Handle mutation records - an array of *attribute-change* records:

```js
// Handling mutation records
function handleChanges( records ) {
    for ( const record of records ) {
        console.log( record.name );
    }
}
```

**-->** Use the `options.oldValue` and `options.newValue` flags to require attribute's old and new values respectively:

```js
// Requiring attribute's old and new value
realtime( element, 'attr' ).observe( [ 'draggable' ], handleChanges, { newValue: true, oldValue: true } );
```

```js
// Inspecting attribute's old and new value
function handleChanges( records ) {
    for ( const record of records ) {
        console.log( record.name, record.value, record.oldValue );
    }
}
```

**-->** Use the `record.target` property to access the *mutation target* - the element on which mutation happened:

```js
// Inspecting record.target
function handleChanges( records ) {
    console.log( records[ 0 ].target );
}
```

**-->** Where exactly one attribute is being observed and is passed as a string instead of an array, mutation records are delivered in singular form instead of as an array:

```js
// Passing the observed attribute as a bare string instead of an array
realtime( element, 'attr' ).observe( 'draggable', handleChanges );
```

```js
// Receiving records in singular form instead of as an array
function handleChanges( record ) {
    console.log( record.name );
}
```

### Concept: *Atomic Delivery*

Get records for multiple attributes delivered atomically - in whole - whenever *any* of the attributes change:

```js
// Observing multiple attributes atomically
realtime( element, 'attr' ).observe( [ 'attr1', 'attr2', 'attr3' ], handleChanges, { atomic: true } );
```

```js
// Receiving all 3 records anytime any one of them changes
function handleChanges( records ) {
    const [ attr1, attr2, attr3 ] = records;
}
```

### Concept: *Event Details*

Use the `option.eventDetails` flag to require the actual DOM operation that happened under the hood:

```js
// Requiring that event details be added
realtime( element, 'attr' ).observe( [ 'draggable' ], handleChanges, { eventDetails: true } );
```

```js
// Inspecting record.event
function handleChanges( records ) {
    console.log( records[ 0 ].event );
}
```

*You get an array in the format: `[ HTMLInputElement, 'toggleAttribute' ]` - for mutations that happen programatically:*

```js
// Running an operation
element.toggleAttribute( 'required' );
```

*You get the keyword: `mutation` - for mutations that happen in other ways; e.g in when the user directly alters an element's attribute from the browser console.*

### Concept: *Abort Signals*

Pass in an [Abort Signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) that you can use to abort your mutation listener at any time:

```js
// Providing an AbortSignal
const abortController = new AbortController;
realtime( element, 'attr' ).observe( [ 'required' ], { signal: abortController.signal } );
```

```js
// Abort at any time
abortController.abort();
```

### Concept: *Life Cycle Signals*

When dealing with nested event listeners (*[see above](#concept-life-cycle-signals)*), use the `options.lifecycleSignals` parameter to opt in to receiving auto-generated signals for tying nested listeners:

```js
// Managing nested lifecycles using automatic lifecycle signals
const parentAbortController = new AbortController;
realtime( element, 'attr' ).observe( [ 'draggable' ], ( records, flags ) => {
    if ( records[ 0 ].value === 'true' ) {
        element.addEventListener( 'drag', handleDrag, { signal: flags.signal } );
    }
}, { newValue: true, signal: parentAbortController.signal, lifecycleSignals: true } );
```

```js
// Abort parent at any time
parentAbortController.abort();
// The latest flags.signal instance is also automatically aborted
```

### Concept: *Timing*

For when timing is critical (*[see above](#concept-timing)*), use the `options.timing = "sync"` parameter to observe mutations *synchronously*:

```js
// Opting in to "synchronous" timing
realtime( element, 'attr' ).observe( [ 'draggable' ], records => {
    // Handle records
}, { timing: 'sync' } );
```

**-->** Use the `options.timing = "intercept"` parameter to observe attribute mutations *before* they actually happen:

```js
// Opting in to "synchronous" timing
realtime( img, 'attr' ).observe( [ 'src' ], records => {
    // Handle records
}, { timing: 'intercept' } );
```

### Method: `realdom.realtime( context, 'attr' ).get()`

Work with attributes both on-demand and in *realtime* (as you would with `realtime( element, 'attr' ).observe()`).

```js
// Signature 1
realtime( context, 'attr' ).get([ callback = undefined[, options = {} ]]);
```

```js
// Signature 2
realtime( context, 'attr' ).get( targets[, callback = undefined[, options = {} ]]);
```

```js
// Signature 3
const records = realtime( context, 'attr' ).get([ options = {} ]);
```

### Concept: *Scope*

Get all attributes on the given element:

```js
// Getting all attributes delivered to a handler
realtime( document.body, 'attr' ).get( handleChanges );
```

```js
// Retreiving all attributes
const records = realtime( document.body, 'attr' ).get();
// Deligating to handler
handleChanges( records );
```

### Concept: *Targets*

Get specific attributes on the given context:

```js
// Getting the "draggable" attributes delivered to a handler
realtime( element, 'attr' ).get( [ 'draggable' ], handleChanges );
```

```js
// Retreiving the "draggable" attributes
const records = realtime( document.body, 'attr' ).get( [ 'draggable' ] );
// Deligating to handler
handleChanges( records );
```

### Concept: *Realtime Attributes*

Get both current and future attributes delivered to the same handler function:

```js
// Getting the "draggable" attributes delivered to a handler
realtime( element, 'attr' ).get( [ 'draggable' ], handleChanges );
// Observing future "draggable" attribute changes
realtime( element, 'attr' ).observe( [ 'draggable' ], handleChanges );
```

**-->** Use the `options.live` flag to achieve the same:

```js
// Getting current and future state of the "draggable" attributes delivered to a handler
realtime( element, 'attr' ).get( [ 'draggable' ], handleChanges, { live: true } );
```

**-->** Use the `options.live` flag in conjunction with other concepts:

```js
// Using the options.live flag with other flags
const abortController = new AbortController;
realtime( element, 'attr' ).get( [ 'attr1', 'attr2', 'attr3' ], handleChanges, {
    newValue: true,
    oldValue: true,
    atomic: true,
    live: true,
    signal: abortController.signal,
    lifecycleSignals: true,
    timing: 'sync',
    eventDetailsL true,
} );
```

### Method: `realdom.realtime( context ).attr()`

*An alias for [`realtime( context, 'attr' ).get()`](#method-realdomrealtime-context-attr-get).*


### Implementation Notes

+ The `realtime` API's unique timing capabilities is based on literal interception of DOM APIs. And here is the complete list of them:
    
    + `Node`: `insertBefore`, `replaceChild`, `removeChild`, `appendChild`, `textContent`, `nodeValue`.
    + `Element`: `insertAdjacentElement`, `insertAdjacentHTML`, `setHTML`, `replaceChildren`, `replaceWith`, `remove`. `before`, `after`, `append`, `prepend`, `toggleAttribute`, `removeAttribute`, `setAttribute`.
    + `HTMLElement`: `outerText`, `innerText`.
    
    You may need to consider this caveat on your specific usecase.

## The Render Scheduling API

Eliminate layout thrashing by scheduling DOM read/write operations. (Compare [fastdom](https://github.com/wilsonpage/fastdom))

```js
schedule( 'read', () => {
  console.log( 'reading phase of the UI' );
} );

schedule( 'write', () => {
  console.log( 'writing phase of the UI' );
} );

schedule( 'read', () => {
  console.log( 'reading phase of the UI'  );
} );

schedule( 'write', () => {
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

The `schedule` API works as a regulatory layer between your app/library and the DOM. It lets you think of the DOM in terms of a "reading" phase and a "writing" phase, and lets you hook into this cycle when working with the DOM: `schedule( 'read', ... )` for doing "read" operations, and `schedule( 'write', ... )` for doing "write" operations. Batching DOM operations this way lets us avoid unnecessary document reflows and dramatically speeds up layout performance.

> Each read/write operation is added to a corresponding read/write queue. The queues are emptied (reads, then writes) at the turn of the next frame using `window.requestAnimationFrame`.

### Method: `realdom.schedule( 'read', ... )`

```js
// Signature
schedule( 'read', readCallback[, inPromiseMode = false ]);
```

Schedules a job for the "read" phase. Can return a promise that resolves when job eventually executes; you ask for a promise by supplying `true` as a second argument.

```js
const promise = schedule( 'read', () => {
  const width = element.clientWidth;
}, true/*give back a promise*/ );
```

### Method: `realdom.schedule( 'write', ... )`

```js
// Signature
schedule( 'write', writeCallback[, inPromiseMode = false ]);
```

Schedules a job for the "write" phase. Can return a promise that resolves when job eventually executes; you ask for a promise by supplying `true` as a second argument.

```js
const promise = schedule( 'write', () => {
  element.style.width = width + 'px';
}, true/*give back a promise*/ );
```

### Method: `realdom.schedule( 'cycle', ... )`

```js
// Signature
schedule( 'cycle', readCallback, writeCallback );
```

Puts your read/write operations in a cycle that keeps in sync with the UI's read/write cycle.

```js
schedule( 'cycle',
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

To report bugs or request features, please submit an [issue](https://github.com/webqit/realdom/issues).

## License

MIT.

[npm-version-src]: https://img.shields.io/npm/v/@webqit/realdom?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@webqit/realdom
[npm-downloads-src]: https://img.shields.io/npm/dm/@webqit/realdom?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@webqit/realdom
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@webqit/realdom?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@webqit/realdom
[license-src]: https://img.shields.io/github/license/webqit/realdom.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/webqit/realdom/blob/master/LICENSE
