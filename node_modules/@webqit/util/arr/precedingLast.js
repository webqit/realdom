
/**
 * @imports
 */
import _preceding from './preceding.js';

/**
 * Alias of _preceding() but uses last instance of reference.
 *
 * @param array 		arr
 * @param mixed	 		reference
 * @param int|bool 		length
 * @param bool|function	loop
 *
 * @return mixed|array
 */
export default function(arr, reference, length = false, loop = false) {
	return _preceding(arr, reference, length, loop, true/*lastReference*/);
};
