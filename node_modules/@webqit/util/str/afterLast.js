
/**
 * @imports
 */
import _after from './after.js';

/**
 * Return the remainder of a string after last occurence of a given value.
 *
 * @param  string  subject
 * @param  string  search
 *
 * @return string
 */
export default function(subject, search) {
	return _after(subject, search, true);
}
