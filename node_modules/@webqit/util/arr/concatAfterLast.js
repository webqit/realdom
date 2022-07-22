
/**
 * @imports
 */
import _concatAfter from './concatAfter.js';

/**
 * Adds A LIST OF ITEMS after the LAST instance of the given reference.
 *
 * @param array 	arr
 * @param mixed	 	reference
 * @param array	 	itms
 *
 * @return array
 */
export default function(arr, reference, itms) {
	return _concatAfter(arr, itms, reference, true/*lastReference*/);
};
