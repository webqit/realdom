
/**
 * @imports
 */
import _isUndefined from '../js/isUndefined.js';
import _isFunction from '../js/isFunction.js';

/**
 * 1. Returns the ENTRY following (either the FIRST or the LAST instance of) the reference.
 * 2. Returns A NUMBER OF ENTRIES counting forwards from (either the FIRST or the LAST instance of) the given reference.
 *
 * @param array 		arr
 * @param mixed	 		reference
 * @param int|bool 		length
 * @param bool|function	 loop
 * @param bool	 		lastReference
 *
 * @return mixed|array
 */
export default function(arr, reference, length = false, loop = false, lastReference = false) {
	if (arr.indexOf(reference) === -1) {
		return length ? [] : undefined;
	}
	var amount = length === true ? arr.length - 1 : (length === false ? 1 : length);
	var from = lastReference ? arr.lastIndexOf(reference) + 1 : arr.indexOf(reference) + 1;
	var after = !_isUndefined(reference) ? arr.slice(from, from + amount) : [];
	if (loop && after.length < amount && after.length < arr.length) {
		if (!_isFunction(loop) || loop(amount - after.length)) {
			after = after.concat(arr.slice(0, amount - after.length));
		}
	};
	return length ? after : after[0];
};
