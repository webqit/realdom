
/**
 * @imports
 */
import _mergeCallback from './mergeCallback.js';

/**
  * Merges values from subsequent arrays/objects first array/object;
  * optionally recursive
  *
  * @param array ...objs
  *
  * @return void
  */
export default function(...objs) {
	return _mergeCallback(objs, (k, obj1, obj2) => {
		return true;
	}, false/*deepProps*/, false/*isReplace*/, false/*withSymbols*/);
};
