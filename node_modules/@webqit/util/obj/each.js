
/**
 * @imports
 */
import _isTypeObject from '../js/isTypeObject.js';
import _isNumeric from '../js/isNumeric.js';

/**
 * Loops thru obj flatly with a callback function.
 * Stops when callback returns a non-undefined value.
 *
 * @param array|object 			obj 			The array or object to iterate.
 * @param function 				callback 		The callback function.
 *
 * @return mixed|null			Any non-null return from callback
 */
export default function(obj, callback) {
	var returnValue = undefined;
	if (_isTypeObject(obj)) {
		Object.keys(obj).forEach((k, i) => {
			if (returnValue !== false) {
				returnValue = callback(_isNumeric(k) ? parseFloat(k) : k, obj[k], i);
			}
		});
	}
	return returnValue;
};
