
/**
 * Tells if val is pure object.
 *
 * @param object	 	val
 *
 * @return bool
 */
export default function(val) {
	return !Array.isArray(val) && typeof val === 'object' && val;
};
