
/**
 * @imports
 */
import _isNumber from './isNumber.js';

/**
 * Returns a timeout promise.
 *
 * @param mixed		proxy
 *
 * @return Promise
 */
export default function(duration) {
    if (!_isNumber(duration)) {
        throw new Error('Duration must be a number.');
    }
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
};