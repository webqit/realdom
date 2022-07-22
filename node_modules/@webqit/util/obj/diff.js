
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isFunction from '../js/isFunction.js';
import _compareCallback from './compareCallback.js';

/**
 * Gets the difference(s) between (members of) two objects;
 * optionally with custom assertion.
 *
 * @param mixed 			ob1
 * @param mixed 			obj2
 * @param string|function	assertion
 * @param bool				netDiff
 *
 * @return object|undefined
 */
const _diff = function(obj1, obj2, assertion = true, netDiff = true) {
	return _compareCallback(obj1, obj2, (v1, v2) => {
		if ((_isArray(v1) && _isArray(v2)) || (_isObject(v1) && _isObject(v2))) {
			return _diff(v1, v2, assertion, netDiff);
		}
		return _isFunction(assertion) ? assertion(v1, v2) : (v1 === v2) === assertion;
	}, netDiff/*netComparison*/, true/*contrast*/);
};

/**
 * @exports
 */
export default _diff;
