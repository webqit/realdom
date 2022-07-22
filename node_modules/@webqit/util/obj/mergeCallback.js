
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isFunction from '../js/isFunction.js';
import _isObject from '../js/isObject.js';
import _isTypeObject from '../js/isTypeObject.js';
import _isNumeric from '../js/isNumeric.js';
import _getAllPropertyNames from './getAllPropertyNames.js';

/**
  * Merges values from subsequent arrays/objects first array/object;
  * optionally recursive
  *
  * @param array ...objs
  *
  * @return void
  */
export default function mergeCallback(objs, callback, deepProps = false, isReplace = false, withSymbols = false) {
	var depth = 0;
	var obj1 = objs.shift();
	if (_isNumeric(obj1) || obj1 === true || obj1 === false) {
		depth = obj1;
		obj1 = objs.shift();
	}
	if (!objs.length) {
		throw new Error('_merge() requires two or more array/objects.');
	}
	objs.forEach((obj2, i) => {
		if (!_isTypeObject(obj2) && !_isFunction(obj2)) {
			return;
		}
		(deepProps ? _getAllPropertyNames(obj2) : Object.keys(obj2)).forEach(key => {
			if (!callback(key, obj1, obj2, i)) {
				return;
			}
			var valAtObj1 = obj1[key];
			var valAtObj2 = obj2[key];
			if (((_isArray(valAtObj1) && _isArray(valAtObj2)) || (_isObject(valAtObj1) && _isObject(valAtObj2))) 
			&& (depth === true || depth > 0)) {
				// RECURSE...
				obj1[key] = _isArray(valAtObj1) && _isArray(valAtObj2) ? [] : {};
				mergeCallback([_isNumeric(depth) ? depth - 1 : depth, obj1[key], valAtObj1, valAtObj2], callback, deepProps, isReplace, withSymbols);
			} else {
				if (_isArray(obj1) && _isArray(obj2)) {
					if (isReplace) {
						obj1[key] = valAtObj2;
					} else {
						obj1.push(valAtObj2);
					}
				} else {
					// In case we're setting a read-only property
					try {
						if (withSymbols) {
							Object.defineProperty(obj1, key, Object.getOwnPropertyDescriptor(obj2, key));
						} else {
							obj1[key] = obj2[key];
						}
					} catch(e) {}
				}
			}
		});
	});
	return obj1;
};
