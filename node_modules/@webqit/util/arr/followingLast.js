
/**
 * @imports
 */
import _following from './following.js';

/**
 * Alias of _following() but uses last instance of reference.
 *
 * @param array 		arr
 * @param mixed	 		reference
 * @param int|bool 		length
 * @param bool|function	loop
 *
 * @return mixed|array
 */
export default function(arr, reference, length = false, loop = false) {
	return _following(arr, reference, length, loop, true/*lastReference*/);
};
