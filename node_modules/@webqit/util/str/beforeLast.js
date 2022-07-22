
/**
 * @imports
 */
import _before from './before.js';

/**
 * Return the part of a string before last occurence of a given value.
 *
 * @param  string  subject
 * @param  string  search
 *
 * @return string
 */
export default function(subject, search) {
	return _before(subject, search, true);
};
