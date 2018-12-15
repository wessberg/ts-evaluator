import {loopWhile} from "deasync";

/**
 * A synchronous way to await a result
 * @param {Promise<T>} promise
 * @return {T}
 */
export function syncAwait<T> (promise: Promise<T>): T {
	let done = false;
	let rejected = false;
	let resolveResult: unknown;
	let rejectResult: unknown;

	promise.then(function (resolve) {
		done = true;
		resolveResult = resolve;
	})
		.catch(function (e) {
			done = true;
			rejected = true;
			rejectResult = e;
		});

	loopWhile(() => !done);

	if (rejected) {
		throw rejectResult;
	}
	return resolveResult as T;
}