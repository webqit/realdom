
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isNumeric from '../js/isNumeric.js';

/**
 * Flattens a nested array to the given depth.
 *
 * @param array 	arr
 * @param int 	 	depth
 * @param bool 	 	withObjects
 *
 * @return array
 */
const _flatten = function(arr, depth = 1, withObjects = true) {
	if (!_isNumeric(depth) || depth <= 0) {
		return arr;
	};
	if (!_isArray(arr) && _isObject(arr) && withObjects) {
		arr = Object.values(arr);
	};
	if (!_isArray(arr)) {
		return arr;
	};
	return arr.reduce((acc, val) => _isArray(val) || (_isObject(val) && withObjects) 
		? acc.concat(_flatten(!_isArray(val) ? Object.values(val) : val, depth - 1, withObjects)) 
		: acc.concat(val), []);
};

/**
 * @exports
 */
export default _flatten;