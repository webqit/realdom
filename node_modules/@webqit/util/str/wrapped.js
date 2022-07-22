
/**
 * Tells if the string is warapped with the given opening and closing tags.
 *
 * @param  string  subject
 * @param  string  openingTag
 * @param  string  closingTag
 *
 * @return bool
 */
export default function(subject, openingTag, closingTag) {
	return subject.startsWith(openingTag) && subject.endsWith(closingTag);
};
