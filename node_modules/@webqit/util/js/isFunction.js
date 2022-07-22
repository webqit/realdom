
/**
 * @imports
 */
import _isTypeFunction from './isTypeFunction.js';

/**
 * Tells if val is of type "function".
 *
 * @param object 		val
 *
 * @return bool
 */
export default function(val) {
	return _isTypeFunction(val) || (val && {}.toString.call(val) === '[object function]');
};
