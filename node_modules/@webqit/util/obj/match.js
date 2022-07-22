
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isFunction from '../js/isFunction.js';
import _compareCallback from './compareCallback.js';

/**
 * Gets the match(es) between (members of) two objects;
 * optionally with custom assertion.
 *
 * @param mixed 			ob1
 * @param mixed 			obj2
 * @param string|function	assertion
 * @param bool				netMatch
 *
 * @return object|undefined
 */
const _match = function(obj1, obj2, assertion = true, netMatch = true) {
	return _compareCallback(obj1, obj2, (v1, v2) => {
		if ((_isArray(v1) && _isArray(v2)) || (_isObject(v1) && _isObject(v2))) {
			return _match(v1, v2, assertion, netMatch);
		}
		return _isFunction(assertion) ? assertion(v1, v2) : (isNaN(v1) && isNaN(v2) ? assertion : (v1 === v2) === assertion);
	}, netMatch/*netComparison*/);
};

/**
 * @exports
 */
export default _match;
