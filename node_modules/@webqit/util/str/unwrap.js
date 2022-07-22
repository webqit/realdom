
/**
 * @imports
 */
import _after from './after.js';
import _beforeLast from './beforeLast.js';

/**
 * Returns the string without the given opening and closing tags.
 *
 * @param  string  subject
 * @param  string  openingTag
 * @param  string  closingTag
 *
 * @return string
 */
export default function(subject, openingTag, closingTag) {
	return _beforeLast(_after(subject, openingTag), closingTag);
};
