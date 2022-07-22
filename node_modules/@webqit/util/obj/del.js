
/**
 * @imports
 */
import _isTypeObject from '../js/isTypeObject.js';
import _isFunction from '../js/isFunction.js';
import _arrFrom from '../arr/from.js';
import _get from './get.js';

/**
 * Unsets a value from the given path.
 *
 * @param object 				obj
 * @param array 				path
 * @param bool|function 		reduceTree
 * @param object 				trap
 *
 * @return bool
 */
export default function(obj, path, reduceTree = false, trap = {}) {
	path = _arrFrom(path);
	var success = false;
	do {
		var lastKey = path.pop();
		var lastKey = lastKey === ''/*null*/ ? 0 : lastKey;
		var _obj = obj;
		if (path.length) {
			_obj = _get(obj, path, {}/*reciever*/, trap);
		}
		if ((_isTypeObject(_obj) || _isFunction(_obj)) && (trap.has ? trap.has(_obj, lastKey) : lastKey in _obj)) {
			if (trap.deleteProperty) {
				success = trap.deleteProperty(_obj, lastKey);
			} else if (trap.del) {
				success = trap.del(_obj, lastKey);
			} else {
				delete _obj[lastKey];
				success = true;
			}
		}
	} while (success && reduceTree && path.length && (_isTypeObject(_obj) || _isFunction(_obj)) && !(trap.keys ? trap.keys(_obj) : Object.keys(_obj)).length);
	return success;
};
