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

const { dom, MutationObserver, Reflow } = window.wq;
```

## Document-Ready Method

```js
dom.ready( () => {
} );
```

## Realtime

### `MutationObserver.observe()`

```js
const logMutations = record => {
    console.log( record.target, record.addedNodes, record.removedNodes, record.type );
}
```

```js
// Capture all "p" elements being added or removed, within the document context
MutationObserver.observe( document, 'p', logMutations, { subtree: true } );
```

### `MutationObserver.intercept()`

```js
const logInterceptions = record => {
    console.log( record.target, record.incomingNodes, record.outgoingNodes, record.type );
}
```

```js
// Capture all "p" elements BEFORE they are added or removed, within the document context
MutationObserver.intercept( document, 'p', logInterceptions, { subtree: true } );
```

## Documentation

Coming Soon.

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/dom/issues).

## License

MIT.
