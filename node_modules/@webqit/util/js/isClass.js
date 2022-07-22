
/**
 * @imports
 */
import _isTypeFunction from './isTypeFunction.js';

/**
 * Tells if val is of type "class".
 *
 * @param object 		val
 *
 * @return bool
 */
export default function(val) {
	return _isTypeFunction(val) && /^class\s?/.test(Function.prototype.toString.call(val));
};
