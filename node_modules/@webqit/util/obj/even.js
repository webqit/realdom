
/**
 * @imports
 */
import _isNumber from '../js/isNumber.js';
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isTypeObject from '../js/isTypeObject.js';
import _isFunction from '../js/isFunction.js';
import _isPlainObject from '../js/isPlainObject.js';
import _compareCallback from './compareCallback.js';

/**
 * Asserts (members of) the first value against (members of) subsequent values.
 * Assertion could be TRUE, FALSE, or custom.
 *
 * @param mixed 			obj1
 * @param mixed 			obj2
 * @param bool|function		assertion
 * @param int				depth
 *
 * @return bool
 */
const _even = function(obj1, obj2, assertion = true, depth = 1) {
	if (_isArray(obj1) && _isArray(obj2) && obj1.length !== obj2.length) {
		return !assertion;
	}
	if (_isObject(obj1) && _isObject(obj2)) {
		var obj1Keys = Object.keys(obj1);
		var obj2Keys = Object.keys(obj2);
		if (!obj1Keys.length && !obj2Keys.length) {
			// Objects that won't show keys must be compared by instance
			// Many native objects won't. So we can't judge by keys alone.
			return _isPlainObject(obj1) && _isPlainObject(obj2) 
				? assertion
				: (obj1 === obj2) === assertion;
		}
		if (!_even(obj1Keys, obj2Keys)) {
			return !assertion;
		}
	}
	if (depth > 0 && ((_isArray(obj1) && _isArray(obj2)) || (_isObject(obj1) && _isObject(obj2)))) {
		var result = _compareCallback(obj1, obj2, (v1, v2) => {
			return _even(v1, v2, assertion, depth - 1);
		}, false/*netComparison*/, false/*contrast*/, true/*returnOnFirstFalse*/);
		return _isArray(result) 
			? result.length === obj1.length && result.length === obj2.length 
			: (_isObject(result) && _isObject(obj1) 
				? Object.keys(result).length === Object.keys(obj1).length && Object.keys(result).length ===  Object.keys(obj2).length 
				: result);
	}
	return _isFunction(assertion) ? assertion(obj1, obj2) : (
		_isNumber(obj1) && _isNumber(obj2) && isNaN(obj1) && isNaN(obj2) 
			? assertion 
			: (obj1 === obj2) === assertion
	);
};

/**
 * @exports
 */
export default _even;
