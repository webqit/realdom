
/**
 * @imports
 */
import _isObject from './isObject.js';

/**
 * Tells if an object is direct instance of Object.prototype.
 * Quite useful in differentiating native objects and class instances from plain objects ({}).
 *
 * @param object 	obj
 *
 * @return bool
 */
export default function(obj) {
	return _isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;
};
