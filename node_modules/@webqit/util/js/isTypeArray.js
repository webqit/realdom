
/**
 * @imports
 */
import _isString from './isString.js';
import _isUndefined from './isUndefined.js';

/**
 * Tells if val is "array-like".
 * This holds true for anything that has a length property.
 *
 * @param object	 	val
 *
 * @return bool
 */
export default function(val) {
	return !_isString(val) && !_isUndefined(val.length);
};
