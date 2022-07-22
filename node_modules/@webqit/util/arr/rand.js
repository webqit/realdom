
/**
 * Gets one or more random values from an array.
 *
 * @param array 	arr
 * @param int	 	amount
 *
 * @return mixed|array
 */
export default function(arr, amount = 1) {
	var result = [];
	var rand = null;
	while (result.length < amount && (rand = arr[Math.floor(Math.random() * arr.length)]) && result.indexOf(rand) === -1) {
		result.push(rand);
	};
	return arguments.length > 1 ? result : result[0];
};
