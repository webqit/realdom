
/**
 * Tells if the array "a" ends with array "b".
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Bool} dotSafe 
 * 
 * @returns Bool
 */
export default function startsWith(a, b, dotSafe = null) {
	return dotSafe || (dotSafe !== false && a.dotSafe && b.dotSafe) 
		? ('.' + a.join('.')).endsWith('.' + b.join('.')) 
		: (a = a.slice(a.length - b.length)) && b.reduce((prev, value, i) => prev && value === a[i], true);
}