
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _isObject from '../js/isObject.js';
import _isTypeObject from '../js/isTypeObject.js';
import _isBoolean from '../js/isBoolean.js';
import _each from './each.js';

/**
 * Gets the match(es) between (members of) two values;
 * assertion optionally custom.
 *
 * @param mixed 			ob1
 * @param mixed 			obj2
 * @param string|function	assertion
 * @param bool				netComparison
 * @param bool				contrast
 * @param bool				returnOnFirstFalse
 *
 * @return bool|array|object
 */
export default function(obj1, obj2, assertion = true, netComparison = true, contrast = false, returnOnFirstFalse = false) {
	if (_isArray(obj1) && _isArray(obj2)) {
		var result = [];
		var contn = true;
		obj1.forEach(v1 => {
			if (!contn) {
				return;
			}
			var testPass = false;
			_each(obj2, (k, v2) => {
				if (!testPass || (netComparison && _isTypeObject(v1))) {
					testPass = assertion(v1, v2);
					if ((_isArray(testPass) && !testPass.length) || (_isObject(testPass) && !Object.keys(testPass).length)) {
						testPass = false;
					}
					if (_isTypeObject(testPass) && netComparison) {
						// Further recursions should use this testPass as v1
						v1 = testPass;
					}
				}
			});
			if (_isTypeObject(testPass)) {
				result.push(netComparison ? testPass : v1);
			} else if (!_isBoolean(testPass)) {
				result.push(testPass);
			} else if ((contrast && !testPass) || (!contrast && testPass)) {
				result.push(v1);
			} else if (returnOnFirstFalse) {
				contn = false;
			}
		});
		return result;
	}
	
	if (_isObject(obj1) && _isObject(obj2)) {
		var result = {};
		var contn = true;
		Object.keys(obj1).forEach(k => {
			if (!contn) {
				return;
			}
			var testPass = assertion(obj1[k], obj2[k]);
			if ((_isArray(testPass) && !testPass.length) || (_isObject(testPass) && !Object.keys(testPass).length)) {
				testPass = false;
			}
			if (_isTypeObject(testPass)) {
				result[k] = netComparison ? testPass : obj1[k];
			} else if (!_isBoolean(testPass)) {
				result[k] = testPass;
			} else if ((contrast && !testPass) || (!contrast && testPass)) {
				result[k] = obj1[k];
			} else if (returnOnFirstFalse) {
				contn = false;
			}
		});
		return result;
	}
};
