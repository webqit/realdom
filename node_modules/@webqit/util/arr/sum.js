
/**
 * Sums an array of numbers.
 *
 * @param array 	arr
 *
 * @return number
 */
export default function(arr) {
	arr = arr.slice();
	return arr.reduce((total, v) => total + v, arr.shift());
};
