
/**
 * Makes a separation between items that pass a callback test and those that fail.
 *
 * @param array	 				arr
 * @param function				callback
 *	 *
 * @return array
 */
export default function(arr, callback) {
	var passes = [];
	var failures = [];
	var length = arr.length;
	for (var i = 0; i < length; i++) {
		if (callback(arr[i])) {
			passes.push(arr[i]);
		} else {
			failures.push(arr[i]);
		};
	};
	return [passes, failures];
};
