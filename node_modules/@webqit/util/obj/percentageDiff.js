
/**
 * @imports
 */
import _percentageMatch from './percentageMatch.js';

/**
 * Asserts (members of) the first value against (members of) subsequent values.
 * Assertion could be TRUE, FALSE, or custom.
 *
 * @param mixed 			obj1
 * @param mixed 			obj2
 * @param bool|function		assertion
 *
 * @return bool
 */
export default function(obj1, obj2, assertion = false) {
	return 1 - _percentageMatch(obj1, obj2, assertion);
};
