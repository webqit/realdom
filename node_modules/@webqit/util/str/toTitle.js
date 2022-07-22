
/**
 * Converts a string to title case.
 *
 * @param string 	str
 * @param bool 		strict
 *
 * @return string
 */
export default function(str, strict) {
	if (typeof str !== 'string') {
		return str;
	}
	return str.replace(/\w\S*/g,  function(txt) { return txt.charAt(0).toUpperCase() + ((typeof strict !== undefined && strict) ? txt.substr(1).toLowerCase() : txt.substr(1)); })
};
