
/**
 * Return the remainder of a string after a given value.
 *
 * @param  string  subject
 * @param  string  search
 * @param  bool	   afterLast
 *
 * @return string
 */
export default function(subject, search, afterLast = false) {
	if (search == '') {
		return subject;
	}
	var pos = afterLast ? subject.lastIndexOf(search) : subject.indexOf(search);
	if (pos === -1) {
		return '';
	}
	return subject.substr(pos + search.length);
};
