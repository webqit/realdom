
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _mergeCallback from './mergeCallback.js';

/**
  * Merges values from subsequent arrays/objects into first array/object but only when not set;
  * optionally recursive
  *
  * @param array ...objs
  *
  * @return void
  */
export default function(...objs) {
	return _mergeCallback(objs, (key, obj1, obj2) => {
		if (_isArray(obj1) && _isArray(obj2)) {
			if (obj1.indexOf(obj2[key]) === -1) {
				return true;
			}
		} else if (!(key in obj1)) {
			return true;
		}
	});
};
