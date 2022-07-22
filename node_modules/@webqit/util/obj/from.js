
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isString from '../js/isString.js';

/**
 * Return an object for the given pair(s) of input.
 *
 * @param string|array 			key
 * @param mixed|array			val 
 *
 * @return object
 */
export default function(key, val = null) {
	var obj = {};
	if (arguments.length === 2) {
		if (_isArray(key) && _isArray(val)) {
			key.forEach((k, i) => obj[k] = val[i]);
		} else {
			obj[key] = val;
		}
	}
	return obj;
};
