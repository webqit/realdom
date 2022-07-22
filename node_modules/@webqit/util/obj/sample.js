
/**
 * @imports
 */
import _isArray from '../js/isArray.js';
import _rand from '../arr/rand.js';
import _copy from './copy.js';

/**
 * Returns a random subset of object.
 *
 * @param array|object 	obj
 * @param int		 	amount
 *
 * @return array|object
 */
export default function(obj, amount = 1) {
	return _isArray(obj) ? _rand(obj) : _copy(obj, _rand(Object.keys(obj), amount));
};
