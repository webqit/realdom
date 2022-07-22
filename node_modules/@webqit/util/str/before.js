
/**
 * Return the part of a string before a given value.
 *
 * @param  string  subject
 * @param  string  search
 * @param  bool	   beforeLast
 *
 * @return string
 */
export default function(subject, search, beforeLast = false) {
	if (search == '') {
		return subject;
	}
	var pos = beforeLast ? subject.lastIndexOf(search) : subject.indexOf(search);
	if (pos === -1) {
		return subject;
	}
	return subject.substr(0, pos);
};
