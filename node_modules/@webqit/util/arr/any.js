
/**
 * Tells if ANY items pass the test.
 *
 * @param array 	arr
 * @param function 	callback
 *
 * @return bool
 */
export default function(arr, callback) {
	return arr.reduce((prevTest, itm, i) => prevTest || callback(itm, i), false);
};
