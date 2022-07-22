
/**
 * @imports
 */
import _first from './first.js';

/**
 * Returns THE LAST ENTRY OR A NUMBER OF ENTRIES counting forward to the end.
 *
 * @param array 	arr
 * @param int	 	amount
 *
 * @return mixed|array
 */
export default function(arr, amount = 1) {
	return arguments.length > 1
		? _first(arr.slice().reverse(), amount).reverse()
		: _first(arr.slice().reverse());
};
