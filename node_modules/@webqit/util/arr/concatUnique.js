
/**
 * @imports
 */
import _pushUnique from './pushUnique.js';
import _from from './from.js';

/**
 * Adds items that do not already exist.
 *
 * @param array 	arr
 * @param array	 	...arrs
 *
 * @return array
 */
export default function(arr, ...arrs) {
	arrs.forEach(_arr => {
		_arr.forEach(itm => _pushUnique(arr, ..._from(_arr)));
	});
	return arr;
};
