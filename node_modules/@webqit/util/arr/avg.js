
/**
 * @imports
 */
import _sum from './sum.js';

/**
 * Gets the average of an array of numbers.
 *
 * @param array 	arr
 *
 * @return number
 */
export default function(arr) {
	return arr.length ? _sum(arr) / arr.length : 0;
};