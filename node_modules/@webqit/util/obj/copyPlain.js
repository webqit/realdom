
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isFunction from '../js/isFunction.js';
import _mergeCallback from './mergeCallback.js';

/**
 * Copies only properties of an object.
 *
 * @param object	 	obj
 * @param array		 	only
 * @param array		 	except
 *
 * @return object
 */
export default function(obj, filter = []) {
	return _mergeCallback([{}, obj], (key, obj1, obj2) => {
		if (!_isFunction(obj2[key])) {
			return _isFunction(filter) ? filter(key) 
				: (_isArray(filter) && filter.length ? filter.indexOf(key) > -1 : true);
		}
	}, false/*deepProps*/, false/*isReplace*/, false/*withSymbols*/);
};
