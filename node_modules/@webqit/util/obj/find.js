
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isFunction from '../js/isFunction.js';
import _isTypeObject from '../js/isTypeObject.js';
import _arrFrom from '../arr/from.js';

/**
 * Finds a value in an array/object and returns the key (or path when found deep).
 *
 * @param array}object 	obj
 * @param function		callback
 * @param bool			deep
 *
 * @return number|string|array
 */
const _find = function(obj, callback, deep = false) {
	var keys = null;
	var values = obj;
	if (!_isArray(obj)) {
		keys = Object.keys(obj);
		values = Object.values(obj);
	}
	var subKey = undefined;
	var value = values.reduce((prev, curr) => {
		if (subKey === undefined) {
			if (callback(curr, prev)) {
				return curr;
			}
			if (deep && (_isTypeObject(curr) || _isFunction(curr)) && (subKey = _find(curr, callback, deep)) !== undefined) {
				return curr;
			}
		}
		return prev;
	}, undefined);
	if (value !== undefined) {
		var key = keys ? keys[values.indexOf(value)] : values.indexOf(value);
		return subKey !== undefined ? [key].concat(_arrFrom(subKey)) : key;
	}
};

/**
 * @exports
 */
export default _find;