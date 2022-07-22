/**
 * 
 * @imports
 */
import _indexOfSet from './indexOfSet.js';

/**
 * Returns the last index of subset array "b" in array "a".
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @param {Int} fromInex 
 * 
 * @returns Int
 */
export default function lastIndexOfSet(a, b, fromInex = null) {
	return _indexOfSet(a, b, fromInex, true);
}