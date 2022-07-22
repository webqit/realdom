
/**
 * Gets the maximum of an array of numbers.
 *
 * @param array 	arr
 *
 * @return number
 */
export default function(arr) {
	arr = arr.slice();
	return arr.reduce((v1, v2) => Math.max(v1, v2), arr.shift());
};
