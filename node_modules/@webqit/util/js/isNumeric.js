
/**
 * @imports
 */
import _isNumber from './isNumber.js';
/**
 * Tells if val is of type "string" or a numeric string.
 * This holds true for both numbers and numeric strings.
 *
 * @param string 	val
 *
 * @return bool
 */
export default function(val) {
	return _isNumber(val) || (val !== true && val !== false && val !== null && val !== '' && !isNaN(val * 1));
};
