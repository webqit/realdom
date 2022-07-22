
/**
 * @imports
 */
import _following from './following.js';
import _preceding from './preceding.js';
import _isFunction from '../js/isFunction.js';

/**
 * Returns ALL THE ENTRIES from (either the FIRST or the LAST instance of) the given reference UNTIL reference2,
 * in ltr/rtl direction.
 *
 * @param array 		arr
 * @param mixed	 		reference
 * @param mixed	 		reference2
 * @param bool	 		rtl
 * @param bool|function	loop
 * @param bool	 		lastReference
 *
 * @return array
 */
export default function(arr, reference, reference2, rtl = false, loop = false, lastReference = false) {
	var from = lastReference ? arr.lastIndexOf(reference) : arr.indexOf(reference);
	var to = lastReference ? arr.lastIndexOf(reference2) : arr.indexOf(reference2);
	if (rtl) {
		var length = to > from 
			? from/*the begining backward*/ + arr.length - to/*the other half*/
			: from - to;
		return _preceding(arr, reference, length, remainder => {
			return _isFunction(loop) ? loop(remainder, 'preceeding') : loop;
		}, lastReference);
	};
	var length = to < from 
		? arr.length - from - 1/*the remainder forward*/ + to + 1/*the other half*/
		: to - from;
	return _following(arr, reference, length, remainder => {
			return _isFunction(loop) ? loop(remainder, 'following') : loop;
		}, lastReference);
};
