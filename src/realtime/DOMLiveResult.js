import { Observer, ListenerRegistry, Descriptor } from '@webqit/observer';
import { symbols } from './Util.js';

export default class DOMLiveResult {

    #context;
    #selector;
    #all;
    #result;
    #abortHandler;
    #aborted = false;
    #listenersRegistry;

    constructor(context, selector, all = false, abortHandler = (() => undefined)) {
        this.#context = context;
        this.#selector = selector;
        this.#all = all;
        this.#result = all ? [] : null;
        this.#abortHandler = abortHandler;
        this.#listenersRegistry = ListenerRegistry.getInstance(this, true);
    }

    get context() { return this.#context; }
    get selector() { return this.#selector; }
    get result() { return this.#result; }
    get aborted() { return this.#aborted; }

    [symbols.dlrApply](record) {
        record.exits.forEach((entry) => {
            if (this.#all) {
                const i = this.#result.indexOf(entry);
                if (i > -1) Observer.proxy(this.#result).splice(i, 1);
            } else if (this.#result === entry) {
                const oldEntry = this.#result;
                const descriptor = new Descriptor(this, {
                    type: 'delete',
                    key: 'result',
                    value: null,
                    oldValue: oldEntry,
                    isUpdate: true,
                    related: [],
                    operation: 'deleteProperty',
                    detail: null,
                });
                this.#result = null;
                this.#listenersRegistry.emit([descriptor]);
            }
        });
        record.entrants.forEach((entry) => {
            if (this.#all) {
                const i = this.#result.indexOf(entry);
                if (i === -1) Observer.proxy(this.#result).push(entry);
            } else {
                const oldEntry = this.#result;
                const descriptor = new Descriptor(this, {
                    type: 'set',
                    key: 'result',
                    value: entry,
                    oldValue: oldEntry,
                    isUpdate: true,
                    related: [],
                    operation: 'set',
                    detail: null,
                });
                this.#result = entry;
                this.#listenersRegistry.emit([descriptor]);
            }
        });
    }

    abort() {
        if (this.#aborted) return;
        this.#aborted = true;
        this.#abortHandler();
    }
}