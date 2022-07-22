
/**
 * @imports
 */
import _isTypeObject from '../js/isTypeObject.js';
import _isFunction from '../js/isFunction.js';
import _isNumeric from '../js/isNumeric.js';
import _isArray from '../js/isArray.js';
import _arrFrom from '../arr/from.js';
import _get from './get.js';

/**
 * Sets a value to the given path.
 *
 * @param object 				obj
 * @param array 				path
 * @param mixed 				val
 * @param object|function 		buildTree
 * @param object 				trap
 *
 * @return bool
 */
export default function(obj, path, val, buildTree = {}, trap = {}) {
	const _set = (target, key, val) => {
		if (trap.set) {
			return trap.set(target, key, val);
		} else {
			if (_isNumeric(path[i]) && _isArray(target)) {
				target.push(val);
			} else {
				target[key] = val;
			}
			return true;
		}
	};
	path = _arrFrom(path);
	var target = obj;
	for(var i = 0; i < path.length; i ++) {
		if (i < path.length - 1) {
			if (!target || (!_isTypeObject(target) && !_isFunction(target))) {
				return false;
			}
			var branch = _get(target, path[i], trap);
			if (!_isTypeObject(branch)) {
				if (trap.buildTree === false) {
					return false;
				}
				branch = _isFunction(trap.buildTree) ? trap.buildTree(i) : (_isNumeric(path[i + 1]) ? [] : {});
				var branchSuccess = _set(target, path[i], branch);
				if (!branchSuccess) {
					return false;
				}
			}
			target = branch;
		} else {
			return _set(target, path[i], val);
		}
	}
};
