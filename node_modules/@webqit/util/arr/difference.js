
/**
 * @imports
 */
import _isArray from '../js/isArray.js';

/**
 * Returns the difference of two arrays;
 * optionally using a custom matching function.
 *
 * @param array 	arr
 * @param array	 	arr2
 * @param function 	callback
 *
 * @return array
 */
export default function(arr, arr2, callback = null) {
	return !_isArray(arr2) ? [] : arr.filter(val1 => callback 
		? arr2.filter(val2 => callback(val1, val2)).length 
		: arr2.indexOf(val1) === -1
	);
};
