
/**
 * @imports
 */
import _isObject from '../js/isObject.js';

/**
 * In an array of numbers, returns the item closest to the given value.
 *
 * @param array|object 	arr
 * @param int 	 		num
 * @param bool 	 		byKey
 *
 * @return number
 */
export default function(arr, num, byKey = false) {
	var keys = null;
	var entries = arr;
	if (byKey || _isObject(entries)) {
		keys = Object.keys(entries);
		entries = keys.map(key => entries[key]);
	}
	var closest = entries.reduce((prev, curr) => {
	  return (Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
	}, undefined);
	return keys ? keys[entries.indexOf(closest)] : closest;
};
