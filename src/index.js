
/**
 * @imports
 */
import { _isNumeric, _isString, _isFunction } from '@webqit/util/js/index.js';
import { _set } from '@webqit/util/obj/index.js';
import Scheduler from './Scheduler.js';
import DOMRealtime from './realtime/DOMRealtime.js';
import AttrRealtime from './realtime/AttrRealtime.js';
import polyfill from './polyfills.js';

export default function () {
    const window = this;
    if (!window.webqit) window.webqit = {};
    if (window.webqit.realdom) return window.webqit.realdom;
    window.webqit.realdom = {};
    polyfill.call(window);
    // ------
    window.webqit.realdom.meta = (...args) => meta.call(window, ...args);
    window.webqit.realdom.ready = (...args) => ready.call(window, ...args);
    // ------
    window.webqit.realdom.realtime = (context, namespace = 'dom') => {
        if (namespace === 'dom') return new DOMRealtime(context, window);
        if (namespace === 'attr') return new AttrRealtime(context, window);
    };
    // ------
    const scheduler = new Scheduler(window);
    window.webqit.realdom.schedule = (type, ...args) => {
        return scheduler[`on${type}`](...args);
    };
    window.webqit.realdom.synthesizeWhile = (...args) => {
        return scheduler.synthesizeWhile(...args);
    };
    // ------
    return window.webqit.realdom;
}


/**
 * DOM-ready listeners.
 * 
 * @param Function	    		callback
 * 
 * @return void
 */
function ready(...args) {
    let timing = 'interactive', callback;
    if (_isString(args[0])) {
        timing = args[0];
        if (_isFunction(args[1])) { callback = args[1]; }
    } else if (_isFunction(args[0])) { callback = args[0]; }
    // --------------
    const timings = { interactive: ['interactive', 'complete'], complete: ['complete'], };
    if (!timings[timing]) throw new Error(`Invalid ready-state timing: ${timing}.`);
    const window = this;
    // --------------
    if (!callback) {
        if (!window.webqit.realdom.readyStatePromises) {
            window.webqit.realdom.readyStatePromises = {
                interactive: new Promise(res => ready.call(this, 'interactive', res)),
                complete: new Promise(res => ready.call(this, 'complete', res)),
            };
        }
        return window.webqit.realdom.readyStatePromises[timing];
    }
    // --------------
    if (timings[timing].includes(window.document.readyState)) return callback(window);
    if (!window.webqit.realdom.readyStateCallbacks) {
        window.webqit.realdom.readyStateCallbacks = { interactive: [], complete: [] };
        window.document.addEventListener('readystatechange', () => {
            const state = window.document.readyState;
            for (const callback of window.webqit.realdom.readyStateCallbacks[state].splice(0)) {
                callback(window);
            }
        }, false);
    }
    window.webqit.realdom.readyStateCallbacks[timing].push(callback);
}

/**
 * A webqit's meta tag props reader.
 *  
 * @param String name
 * 
 * @return Object
 */
function meta(name) {
    const window = this;
    let _content = {}, _el;
    if (_el = window.document.querySelector(`meta[name="${name}"]`)) {
        _content = (_el.content || '').split(';').filter(v => v).reduce((_metaVars, directive) => {
            const directiveSplit = directive.split('=').map(d => d.trim());
            _set(_metaVars, directiveSplit[0].split('.'), directiveSplit[1] === 'true' ? true : (directiveSplit[1] === 'false' ? false : (
                _isNumeric(directiveSplit[1]) ? parseInt(directiveSplit[1]) : directiveSplit[1]
            ))
            );
            return _metaVars;
        }, {});
    }
    return {
        get name() { return name; }, get content() { return _el.content; }, json() {
            return JSON.parse(JSON.stringify(_content));
        }
    };
}

export function isNode(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        typeof value.nodeType === 'number' &&
        typeof value.nodeName === 'string'
    );
}

export function isNodeName(value, nodeName) {
    return isNode(value) && value.nodeName === nodeName.toUpperCase();
}

export function isElement(value) {
    return value?.nodeType === 1; // ELEMENT_NODE
}

export function isShadowRoot(value) {
    return (
        value?.nodeType === 11 && // DOCUMENT_FRAGMENT_NODE
        Object.prototype.toString.call(value) === '[object ShadowRoot]'
    );
}

export function isDocument(value) {
    return value?.nodeType === 9 ;
}

export function isCharacterData(value) {
    const toStringValue = Object.prototype.toString.call(value);
    return toStringValue === '[object Text]' || toStringValue === '[object Comment]' || toStringValue === '[object CDATASection]' || toStringValue === '[object ProcessingInstruction]';
}

export function isNodeInterface(value, interfaceName) {
    if (!isNode(value)) return false;

    if (interfaceName === 'ShadowRoot') {
        return isShadowRoot(value);HTMLUnknownElement
    }

    const toStringValue = Object.prototype.toString.call(value);
    if (toStringValue === `[object ${interfaceName}]`) return true;

    if (interfaceName === 'DocumentFragment' && isShadowRoot(value)) return true;

    if (interfaceName === 'CharacterData' && isCharacterData(value)) return true;

    return (interfaceName === 'Node' || interfaceName === 'Element' || interfaceName === 'HTMLElement') && isElement(value)
        || interfaceName === 'Node' && isNode(value);
}
