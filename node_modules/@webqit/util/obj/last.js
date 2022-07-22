
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _arrLast from '../arr/last.js';

/**
 * Returns the LAST ENTRY.
 *
 * @param array|object 	obj
 *
 * @return mixed
 */
export default function(obj) {
	return _isArray(obj) ? _arrLast(obj) : obj[_arrLast(Object.keys(obj))];
};
