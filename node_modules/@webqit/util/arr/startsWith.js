
/**
 * Tells if the array "a" starts with array "b".
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Bool} dotSafe 
 * 
 * @returns Bool
 */
export default function startsWith(a, b, dotSafe = null) {
	return dotSafe || (dotSafe !== false && a.dotSafe && b.dotSafe) 
		? (a.join('.') + '.').startsWith(b.join('.') + '.') 
		: b.reduce((prev, value, i) => prev && value === a[i], true);
}