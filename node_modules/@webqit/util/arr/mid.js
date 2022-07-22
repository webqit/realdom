
/**
 * Returns the middle item of an array.
 *
 * @param array 	arr
 * @param bool 		all
 *
 * @return any
 */
export default function(arr, all = false) {
	var mid = [];
	if (arr.length) {
		if (arr.length % 2) {
			var start = Math.round(arr.length / 2) - 1;
			mid = arr.slice(start, start + 1);
		} else {
			var start = (arr.length / 2) - 1;
			mid = arr.slice(start, start + 2);
		}
	}
	return all ? mid : mid[0];
};
