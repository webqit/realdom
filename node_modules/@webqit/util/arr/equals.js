
/**
 * Tells if two arrays are shallow equals.
 * 
 * @param {Array} a 
 * @param {Array} b 
 * @param {Bool} dotSafe
 * 
 * @returns Bool
 */
export default function equals(a, b, dotSafe = null) {
	return dotSafe || (dotSafe !== false && a.dotSafe && b.dotSafe) 
		? a.join('.') === b.join('.') 
		: a.length === b.length && a.reduce((prev, value, i) => prev && value === b[i], true);
}