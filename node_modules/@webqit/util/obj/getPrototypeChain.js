
/**
 * @imports
 */
import _isArray from '../js/isArray.js';

/**
 * Returns the prototype chain.
 *
 * @param object 		obj
 * @param object	 	until
 *
 * @return bool
 */
export default function(obj, until) {
	until = until || Object.prototype;
	until = until && !_isArray(until) ? [until] : until;
	// We get the chain of inheritance
	var prototypalChain = [];
	var obj = obj;
	while((obj && (!until || until.indexOf(obj) < 0) && obj.name !== 'default')) {
		prototypalChain.push(obj);
		obj = obj ? Object.getPrototypeOf(obj) : null;
	}
	return prototypalChain;
};
