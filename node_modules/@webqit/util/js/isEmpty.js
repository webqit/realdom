
/**
 * @imports
 */
import _isNull from './isNull.js';
import _isUndefined from './isUndefined.js';
import _isTypeObject from './isTypeObject.js';

/**
 * Tells if val is empty in its own type.
 * This holds true for NULLs, UNDEFINED, FALSE, 0,
 * objects without keys, empty arrays.
 *
 * @param string 	val
 *
 * @return bool
 */
export default function(val) {
	return _isNull(val) || _isUndefined(val) || val === false || val === 0 
		|| (_isTypeObject(val) && !Object.keys(val).length);
};
