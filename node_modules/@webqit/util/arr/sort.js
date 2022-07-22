
/**
 * @imports
 */
import _isString from '../js/isString.js';

/**
 * Sorts a list performantly.
 *
 * @param array	 					arr
 * @param string	 				order			ASC|DESC 
 * @param function					callback
 *
 * @return array
 */
export default function(arr, order, callback = null) {
	var _arr = [];
	// Make a shallow copy
	var length = arr.length;
	for (var i = 0; i < length; i ++) {
		_arr.push({index: i, value: callback ? callback(arr[i]) : arr[i]});
	};
	_arr.sort(function(a, b) {
		// Using localeCompare if possible
		if (_isString(a.value) && "".localeCompare) {
			return a.value.localeCompare(b.value);
		};
		return a.value === b.value ? 0 : a.value > b.value ? 1 : -1;
	});
	if ((order || '').trim().toLowerCase() === 'desc') {
		_arr = _arr.reverse();
	};
	// Fill the order with actual values
	return _arr.map(itm => arr[itm.index]);
};
