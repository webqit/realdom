
/**
 * @imports
 */
import _before from './before.js';

/**
 * Returns members of array "a" before the last array "b" subset.
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * 
 * @returns Bool
 */
export default function beforeLast(a, b, fromInex = null) {
	return _before(a, b, fromInex, true);
}