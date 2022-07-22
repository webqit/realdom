
/**
 * @imports
 */
import _after from '../str/after.js';
import _indexOfSet from './indexOfSet.js';

/**
 * Returns members of array "a" after the array "b" subset.
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * @param {Bool} last 
 * 
 * @returns Bool
 */
export default function after(a, b, fromInex = null, last = false) {
	var subsetIndex = _indexOfSet(a, b, fromInex, last);
	return subsetIndex === -1 ? [] : a.slice(subsetIndex + b.length);
}