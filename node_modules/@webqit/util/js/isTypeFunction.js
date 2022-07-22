
/**
 * Tells if val is of type "function".
 * This holds true for both regular functions and classes.
 *
 * @param object	 	val
 *
 * @return bool
 */
export default function(val) {
	return typeof val === 'function';
};
