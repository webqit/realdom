
/**
 * @imports
 */
import _isTypeFunction from './isTypeFunction.js';

/**
 * Tells if val is of type "object".
 * This holds true for anything object, including built-ins.
 *
 * @param object	 	val
 *
 * @return bool
 */
export default function(val) {
	return Array.isArray(val) || (typeof val === 'object' && val) || _isTypeFunction(val);
};
