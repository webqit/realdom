
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isFunction from '../js/isFunction.js';
import _compareCallback from './compareCallback.js';

/**
 * Asserts (members of) the first value against (members of) subsequent values.
 * Assertion could be TRUE, FALSE, or custom.
 *
 * @param mixed 			obj1
 * @param mixed 			obj2
 * @param bool|function		assertion
 *
 * @return bool
 */
const _percentageMatch = function(obj1, obj2, assertion = true) {
	var result = _compareCallback(obj1, obj2, (v1, v2) => {
		if ((_isArray(v1) && _isArray(v2)) || (_isObject(v1) && _isObject(v2))) {
			return _percentageMatch(v1, v2, assertion);
		}
		return (_isFunction(assertion) ? assertion(v1, v2) : ((isNaN(v1) && isNaN(v2)) === assertion ? true : (v1 === v2) === assertion)) ? 1 : 0;
	}, false/*netComparison*/, false/*contrast*/, true/*returnOnFirstFalse*/);
	var values = _isObject(result) ? Object.values(result) : result;
	return values.reduce((a, b) => a + b, 0) / values.length;
};

/**
 * @exports
 */
export default _percentageMatch;
