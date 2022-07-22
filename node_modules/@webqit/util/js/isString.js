
/**
 * Tells if val is of type "string".
 *
 * @param string 	val
 *
 * @return bool
 */
export default function(val) {
	return val instanceof String || (typeof val === 'string' && val !== null);
};
