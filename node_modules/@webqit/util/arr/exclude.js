
/**
 * @imports
 */
import _remove from './remove.js';

/**
 * Removes all instances of each item.
 *
 * @param array 	arr
 * @param array	 	itms
 *
 * @return array
 */
export default function(arr, ...itms) {
	itms.forEach(itm => _remove(arr, itm));
	return arr;
};
