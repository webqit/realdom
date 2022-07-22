
/**
 * Array slicing with support for negative offsets.
 *
 * @param array	 				arr
 * @param array	 				offset
 * @param array	 				lengthOrOffset2
 *	 *
 * @return array
 */
export default function(arr, offset = 0, lengthOrOffset2 = null) {
	if (arguments.length > 1) {
		offset = offset < 0 ? (arr.length + offset)/*subtraction eventually*/ : offset;
		if (arguments.length > 2) {
			lengthOrOffset2 = lengthOrOffset2 < 0 ? (arr.length + lengthOrOffset2)/*subtraction eventually*/ - offset : lengthOrOffset2;
		};
	};
	return arr.slice(offset, lengthOrOffset2);
};
