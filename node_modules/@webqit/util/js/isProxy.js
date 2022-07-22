
/**
 * @imports
 */
import _isObject from './isObject.js';

/**
 * Tells if a given object instance has been proxied.
 *
 * @param mixed		input
 *
 * @return bool
 */
export default function(input) {
	return (_isObject(input) && input.__proxyTargetByCommons) || false;
};
