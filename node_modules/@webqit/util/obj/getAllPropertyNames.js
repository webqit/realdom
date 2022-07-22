
/**
 * @imports
 */
import _pushUnique from '../arr/pushUnique.js';
import _getPrototypeChain from './getPrototypeChain.js';

/**
 * Eagerly retrieves object members all down the prototype chain.
 *
 * @param object	 	obj
 * @param object	 	until
 *
 * @return array
 */
export default function(obj, until) {
	var keysAll = [];
	_getPrototypeChain(obj, until).forEach(obj => {
		_pushUnique(keysAll, ...Object.getOwnPropertyNames(obj));
	});
	return keysAll;
};
