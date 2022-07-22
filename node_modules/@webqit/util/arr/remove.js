
/**
 * Removes instances of reference up to <limit> times.
 *
 * @param array 	arr
 * @param mixed	 	itm
 * @param int|bool 	limit
 *
 * @return array
 */
export default function(arr, itm, limit = false) {
	var i = arr.indexOf(itm);
	while (i > -1 && (limit || limit === false)) {
		arr.splice(i, 1);
		if (limit > 0) {
			limit --;
		};
		i = arr.indexOf(itm);
	};
	return arr;
};
