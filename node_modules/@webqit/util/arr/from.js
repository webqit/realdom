
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isTypeArray from '../js/isTypeArray.js';
import _isEmpty from '../js/isEmpty.js';
import _isObject from '../js/isObject.js';

/**
 * Casts an array-like object to an array.
 *
 * @param mixed 	val
 * @param bool	 	castObject
 *
 * @return array
 */
export default function(val, castObject = true) {
	if (_isArray(val)) {
		return val;
	};
	if (!castObject && _isObject(val)) {
		return [val];
	};
	if (val !== false && val !== 0 && _isEmpty(val)) {
		return [];
	};
	if (_isTypeArray(val)) {
		return Array.prototype.slice.call(val);
	};
	if (_isObject(val)) {
		return Object.values(val);
	};
	return [val];
};
