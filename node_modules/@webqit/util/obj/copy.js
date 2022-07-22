
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isFunction from '../js/isFunction.js';
import _isNumeric from '../js/isNumeric.js';
import _isTypeObject from '../js/isTypeObject.js';
import _mergeCallback from './mergeCallback.js';

/**
 * Copies an object.
 *
 * @param object	 	obj
 * @param array		 	filter
 *
 * @return object
 */
export default function(obj, filter = [], withSymbols = true) {
	var depth = 0;
	if (_isNumeric(arguments[0]) && _isTypeObject(arguments[1])) {
		depth = arguments[0];
		obj = arguments[1];
		filter = arguments[2] || [];
	}
	return _mergeCallback([depth, {}, obj], (key, obj1, obj2) => {
		return _isFunction(filter) ? filter(key) 
			: (_isArray(filter) && filter.length ? filter.indexOf(key) > -1 : true);
	}, false/*deepProps*/, false/*isReplace*/, withSymbols);
};
