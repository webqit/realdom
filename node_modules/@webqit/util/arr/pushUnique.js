
/**
 * Adds an item if not already exist.
 *
 * @param array 	arr
 * @param array	 	...itms
 *
 * @return array
 */
export default function(arr, ...items) {
	items.forEach(itm => {
		if (arr.indexOf(itm) < 0) {
			arr.push(itm);
		}
	});
	return arr;
};
