/**
 * Resolves promises and handles any success or error cases
 *
 * @param {Promise} promise - Promise to resolve
 *
 * @return {Promise<any>} Promise that resolves a anything
 *
 * @example
 *
 *     await callout(promise);
 */
export async function callout(promise: Promise<any>): Promise<any> {
  return promise.then((data) => [null, data]).catch((err) => [err]);
}