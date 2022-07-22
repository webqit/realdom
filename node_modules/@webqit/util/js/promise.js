
/**
 * Creats a promise instance with the adbantage
 * of being an awaitable function call.
 *
 * @param function	 handler
 *
 * @return Promise
 */
export default function(handler) {
	return new Promise(handler);
};
