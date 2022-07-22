
/**
 * @imports
 */
import _all from './all.js';
import _equals from './equals.js';

/**
 * Tells if two arrays are up to z-level equals.
 *
 * @param {Array} a 
 * @param {Array} b 
 * @param {Bool} dotSafe 
 * 
 * @returns Bool
 */
export default function equals2D(a, b, dotSafe = null) {
	return a.length === b.length && _all(a, (_a, i) => _equals(_a, b[i], dotSafe || (dotSafe !== false && a.dotSafe && b.dotSafe)));
}