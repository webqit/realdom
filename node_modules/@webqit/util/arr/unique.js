
/**
 * Returns a list of unique items.
 *
 * @param array	 				arr
 *	 *
 * @return array
 */
export default function(arr) {
	const distinct = (value, index, self) => {
		return self.indexOf(value) === index;
	};
	return arr.filter(distinct);
};
