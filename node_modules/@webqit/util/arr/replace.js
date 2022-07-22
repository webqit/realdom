
/**
 * @imports
 */
import _each from '../obj/each.js';

/**
 * Removes an item.
 *
 * @param array 	arr
 * @param array	 	itms
 * @param array	 	replacements
 *
 * @return array
 */
export default function(arr, itms, replacements = []) {
	if (arguments.length === 2) {
		itms.forEach((itm, i) => {arr[i] = itm;});
		return arr;
	};
	_each(itms, (k, reference) => {
		var i = arr.indexOf(reference);
		if (i !== -1) {
			arr[i] = replacements[k];
		};
	});
	return arr;
};
