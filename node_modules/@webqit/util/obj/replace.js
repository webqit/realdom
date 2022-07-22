
/**
 * @imports
 */
import _mergeCallback from './mergeCallback.js';

/**
  * Replaces properties of first array/object with values from subsequent arrays/objects;
  * optionally recursive
  *
  * @param array ...objs
  *
  * @return void
  */
export default function(...objs) {
	var replaceIntoEmptyObj = Object.keys(objs[0]).length === 0;
	return _mergeCallback(objs, (key, obj1, obj2, i) => {
		if ((key in obj1) || (replaceIntoEmptyObj && i === 0)) {
			return true;
		}
	}, false/*deepProps*/, true/*isReplace*/);
};
