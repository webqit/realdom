
/**
 * @imports
 */
import _isArray from './isArray.js';

/**
 * Tells if an object is direct instance of Array.prototype.
 * Quite useful in differentiating array-extension instances from plain arrays ([]).
 *
 * @param object 	obj
 *
 * @return bool
 */
export default function(obj) {
	return _isArray(obj) && Object.getPrototypeOf(obj) === Array.prototype;
};
