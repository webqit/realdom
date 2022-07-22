
/**
 * Gets the minimum of an array of numbers.
 *
 * @param array 	arr
 *
 * @return number
 */
export default function(arr) {
	arr = arr.slice();
	return arr.reduce((v1, v2) => Math.min(v1, v2), arr.shift());
};
