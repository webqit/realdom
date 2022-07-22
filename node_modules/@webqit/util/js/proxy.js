
/**
 * @imports
 */
import _merge from '../obj/merge.js';

/**
 * Creats a proxy and keeps special reference to it.
 *
 * @param object	 target
 * @param object	 trap
 *
 * @return Proxy
 */
export default function(target, trap) {
	var trapByCommons = {
		get: (target, prop) => {
			if (prop === '__proxyTargetByCommons') {
				return target;
			}
			if (prop === '__proxyTrapByCommons') {
				return trap;
			}
			return trap.get ? trap.get(target, prop) : target[prop];
		},
	};
	return new Proxy(target, _merge({}, trap, trapByCommons));
};
