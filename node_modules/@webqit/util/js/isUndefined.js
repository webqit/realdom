
/**
 * Tells if val is undefined or is of type "undefined".
 *
 * @param string 	val
 *
 * @return bool
 */
export default function(val) {
	return arguments.length && (val === undefined || typeof val === 'undefined');
};
