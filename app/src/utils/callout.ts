export default class Callout {
	/**
	 * Resolves promises and handles any success or error cases
	 *
	 * @param {Promise} promise - Promise to resolve
	 *
	 * @return {Promise<any>} Promise that resolves a anything
	 *
	 * @example
	 *     await Callout.call(promise);
	 */
	static async call(promise: Promise<any>): Promise<any> {
		return promise.then((data) => [null, data]).catch((err) => [err]);
	}
}