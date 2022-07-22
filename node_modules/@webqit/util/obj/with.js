
/**
 * @imports
 */
import _isObject from '../js/isObject.js';
import _from from './from.js';
import _merge from './merge.js';

/**
 * Return the input object with additional entries.
 *
 * @param object	 			obj
 * @param string|array 			entriesOrKey
 * @param mixed|array			val 
 *
 * @return object
 */
export default function(obj, entriesOrKey, val = null) {
	return _merge(obj, _isObject(entriesOrKey) ? entriesOrKey : _from(entriesOrKey, val));
};
