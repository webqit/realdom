
/**
 * @imports
 */
import _isProxy from './isProxy.js';

/**
 * Returns the proxy's target object as earlier saved.
 *
 * @param mixed		proxy
 *
 * @return mixed
 */
export default function(instance) {
	return _isProxy(instance) ? instance.__proxyTargetByCommons : undefined;
};
