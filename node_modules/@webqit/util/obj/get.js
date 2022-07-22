
/**
 * @imports
 */
import _isTypeObject from '../js/isTypeObject.js';
import _isUndefined from '../js/isUndefined.js';
import _isNull from '../js/isNull.js';
import _arrFrom from '../arr/from.js';

/**
 * Retrieves the value at the given path.
 *
 * A return value of undefined is ambiguous, and can mean either that the
 * path does not exist, or that the path actually exists but with a value of undefined. If it is required to
 * know whether the path actually exists, pass an object as a third argument.
 * This object will have an "exists" key set to true/false.
 *
 * @param object 				ctxt
 * @param array 				path
 * @param object 				trap
 * @param object 				reciever
 *
 * @return mixed
 */
export default function(ctxt, path, trap = {}, reciever = {}) {
	path = _arrFrom(path).slice();
	var _ctxt = ctxt;
	while(!_isUndefined(_ctxt) && !_isNull(_ctxt) && path.length) {
		var _key = path.shift();
		if (!(trap.get ? trap.get(_ctxt, _key) : (_isTypeObject(_ctxt) ? _key in _ctxt : _ctxt[_key]))) {
			reciever.exists = false;
			return;
		}
		_ctxt = trap.get ? trap.get(_ctxt, _key) : _ctxt[_key];
	}
	reciever.exists = true;
	return _ctxt;
};
