
/**
 * @imports
 */
import _toTitle from './toTitle.js';

/**
 * Makes a string camel-cased.
 *
 * @param string 	str
 * @param bool	 	fromStart
 *
 * @return string
 */
export default function(str, fromStart) {
	// Make disting words
	str = _toTitle(str.replace(/-/g, ' ')).replace(/ /g, '');
	return fromStart ? str : str[0].toLowerCase() + str.substr(1);
};
