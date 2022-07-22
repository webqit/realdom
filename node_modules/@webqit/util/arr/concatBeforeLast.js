
/**
 * @imports
 */
import _concatBefore from './concatBefore.js';

/**
 * Adds A LIST OF ITEMS before the LAST instance of the given reference.
 *
 * @param array 	arr
 * @param mixed	 	reference
 * @param array	 	itms
 *
 * @return array
 */
export default function(arr, reference, itms) {
	return _concatBefore(arr, reference, itms, true/*lastReference*/);
};
