
/**
 * @imports
 */
import _before from '../str/before.js';
import _indexOfSet from './indexOfSet.js';

/**
 * Returns members of array "a" before the array "b" subset.
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * @param {Bool} last 
 * 
 * @returns Bool
 */
export default function before(a, b, fromInex = null, last = false) {
	var subsetIndex = _indexOfSet(a, b, fromInex, last);
	return subsetIndex === -1 ? [] : a.slice(0, subsetIndex);
}