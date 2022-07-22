
/**
 * @imports
 */
import _isArray from './isArray.js';
import _isFunction from './isFunction.js';
import _arrLast from '../arr/last.js';
import _mergeCallback from '../obj/mergeCallback.js';
import _each from '../obj/each.js';

/**
 * A multi-inheritance implementstion.
 *
 * @param array	 	...classes
 *
 * @return object
 */
const Implementations = new Map;
export default function mixin(...classes) {
	
	var Traps = {};
	var RetrnDirective = 'last';
	if (_isArray(arguments[0])) {
		classes = arguments[0];
		Traps = arguments[1];
		if (arguments[2]) {
			RetrnDirective = arguments[2];
		}
	}
	// -----------------------
	var Base = _arrLast(classes);
	var supersMap = {};
	// -----------------------
	// Create the Mixin
	// ...with a special constructor.
	// -----------------------
	var Mixin = class {
		constructor(...args) {
			classes.forEach((_class, i) => {
				Reflect.construct(_class, args, this.constructor);
			});
		}
	};
	// -----------------------
	// Implement a special handler of the "instanceof" operator.
	// -----------------------
	classes.forEach((_class, i) => {
		if (!Implementations.has(_class)) {
			Implementations.set(_class, []);
			try {
				var originalInstanceChecker = _class[Symbol.hasInstance];
				Object.defineProperty(_class, Symbol.hasInstance, {value: function(instance) {
					if (originalInstanceChecker.call(this, instance)) {
						return true;
					}
					if (Implementations.has(this)) {
						return Implementations.get(this).reduce((yes, _mixin) => yes || (instance instanceof _mixin), false);
					}
					return false;
				}});
			} catch (e) {
				throw new Error('Cannot mixin the class at index ' + i + '. Class may already have been configured for instance checks somewhere.');
			}
		}
		Implementations.get(_class).push(Mixin);
	});
	// ---------------------
	// Mixin both static and instance properties and methods
	// ---------------------
	classes.forEach(_class => {
		// Copy const members
		_mergeCallback([Mixin, _class], (key, obj1, obj2) => ![
			'name', 'prototype', 'prototypes', 'length', 'caller', 'callee', 'arguments', 'constructor', 'apply', "bind", 'call', 'toString',/**/
		].includes(key), true/*deepProps*/);
		_mergeCallback([Mixin.prototype, _class.prototype], (key, obj1, obj2) => {
			if (!['prototype', 'prototypes'].includes(key)) {
				if (_isFunction(obj2[key])) {
					if (_isArray(supersMap[key])) {
						supersMap[key].push(obj2[key]);
					} else {
						supersMap[key] = [obj2[key]];
					}
					return false;
				}
				return true;
			}
			return false;
		}, true/*deepProps*/);
	});
	// Extend (proxy) methods
	_each(supersMap, (name, supers) => {
		if (name === 'constructor') {
			return;
		}
		// NOTE: this must not be defined as an arrow function
		// for the benefit of the "this".
		Mixin.prototype[name] = function(...args) {
			if (Object.hasOwnProperty(Traps, name) && _isFunction(Traps[name])) {
				// Wrap a call to the trap...
				// So mixin supers are passed to traps
				return Traps[name].call(this, supers, ...args);
			} else {
				// Call each super and return
				// the last one's return value
				var supersReturnValues = [];
				supers.forEach(supr => {
					supersReturnValues.push(supr.call(this, ...args));
				})
				return _arrLast(supersReturnValues);
			}
		};
	});
	return Mixin;
};