
/**
 * @imports
 */
import _get from './get.js';

/**
 * Tells if the given path exists.
 *
 * @param object 				obj
 * @param array 				path
 * @param object 				trap
 *
 * @return bool
 */
export default function(obj, path, trap = {}) {
	var reciever = {};
	_get(obj, path, trap, reciever);
	return reciever.exists;
};
