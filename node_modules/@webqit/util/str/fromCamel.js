
/**
 * Splits a camel-cased string.
 *
 * @param string 	str
 * @param string 	delimiter
 *
 * @return string
 */
export default function(str, delimiter) {
	return str === undefined ? '' : str.split(/(?=[A-Z])/).join(delimiter ? delimiter : ' '); // positive lookahead to keep the capital letters
};
