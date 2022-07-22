
/**
 * Adds A LIST OF ITEMS before the FIRST instance of the given reference.
 *
 * @param array 	arr
 * @param mixed	 	reference
 * @param array	 	itms
 * @param bool	 	lastReference
 *
 * @return array
 */
export default function(arr, reference, itms, lastReference = false) {
	var secondHalf = arr.splice(lastReference ? arr.lastIndexOf(reference) : arr.indexOf(reference));
	itms.concat(secondHalf).forEach(function(itm) {
		arr.push(itm);
	});
	return arr;
};
