
/**
 * @imports
 */
import _after from './after.js';

/**
 * Returns members of array "a" after the last array "b" subset.
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * 
 * @returns Bool
 */
export default function afterLast(a, b, fromInex = null) {
	return _after(a, b, fromInex, true);
}