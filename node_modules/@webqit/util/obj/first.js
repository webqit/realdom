
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _arrFirst from '../arr/first.js';

/**
 * Returns the FIRST ENTRY.
 *
 * @param array|object 	obj
 *
 * @return mixed
 */
export default function(obj) {
	return _isArray(obj) ? _arrFirst(obj) : obj[Object.keys(obj)[0]];
};
