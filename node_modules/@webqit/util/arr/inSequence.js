
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isBoolean from '../js/isBoolean.js';
import _isNumber from '../js/isNumber.js';

/**
 * Calls callback with each item in the list and waits inbetween for each callback's promise to resolve.
 * The delay parameter may be used solely as the wait or as an addition to the promise-based wait.
 *
 * @param int|string|object 	interval
 *
 * @return new Promise
 */
export default function(arr, callback, timing) {
	if (!_isArray(arr)) {
		return;
	};
	if (_isObject(timing)) {
		var sync = timing.sync || false;
		var delay = timing.delay || 0;
		var delayAlways = timing.delayAlways || false;
	} else {
		var sync = _isBoolean(timing) || timing === 'last' ? timing : false;
		var delay = _isNumber(timing) ? timing : 0;
		var delayAlways = false;
	};
	var items = arr;
	var promise = new Promise(function(resolve, reject) {
		if (items.length) {
			var call = function(i) {
				var advance = () => {
					// Delay first before asking items.length
					// Good for progressivly adding new items
					// -----------------------
					if (delayAlways) {
						if (delay) {
							setTimeout(() => {
								if (items.length > i + 1) {
									call(i + 1);
								} else {
									resolve()
								};
							}, delay);
						} else {
							if (items.length > i + 1) {
								call(i + 1);
							} else {
								resolve()
							};
						};
					// Ask items.length first before delay
					// Good for when delay should only be BETWEEN items
					// -----------------------
					} else {
						if (items.length > i + 1) {
							if (delay) {
								setTimeout(() => {call(i + 1);}, delay);
							} else {
								call(i + 1);
							};
						} else {
							resolve()
						};
					};
				};
				var ret = callback(items[i]);
				if (ret instanceof Promise && (sync === true || (sync === 'last' && i === items.length - 1))) {
					// On any of the outcomes...
					ret.then(advance);
					ret.catch(advance);
				} else {
					advance();
				};
			};
			call(0);
		} else {
			resolve();
		};
	});
	return promise;
};
