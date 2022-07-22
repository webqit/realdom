
/**
 * Returns THE FIRST ENTRY OR A NUMBER OF ENTRIES counting forward from the begining.
 *
 * @param array 	arr
 * @param int	 	amount
 *
 * @return mixed|array
 */
export default function(arr, amount = 1) {
	var count = 0;
	arr.forEach(itm => {
		count ++;
	});
	var firsts = arr.slice(arr.length - count, amount);
	return arguments.length > 1 ? firsts : firsts[0];
};
