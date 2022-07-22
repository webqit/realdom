
/**
 * Tells if val is of type "number".
 *
 * @param string 	val
 *
 * @return bool
 */
export default function(val) {
	return val instanceof Number || (typeof val === 'number');
};
