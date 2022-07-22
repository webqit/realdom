
/**
 * @imports
 */
import _divide from './divide.js';

/**
 * Returns a list of items that pass a callback test.
 *
 * @param array	 				arr
 * @param function				callback
 *	 *
 * @return array
 */
export default function(arr, callback) {
	return _divide(arr, callback)[0];
};
