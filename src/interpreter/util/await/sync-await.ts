import {AsyncNotSupportedError} from "../../error/async-not-supported-error/async-not-supported-error";

let loopWhile: (typeof import("deasync").loopWhile)|undefined;

try {
	// tslint:disable-next-line:no-require-imports no-var-requires
	const importedModule = require("deasync") as typeof import("deasync");
	loopWhile = importedModule.loopWhile;
} catch {
	// This is OK
}

/**
 * A synchronous way to await a result
 * @param {Promise<T>} promise
 * @return {T}
 */
export function syncAwait<T> (promise: Promise<T>): T {
	if (loopWhile === undefined) {
		// Throw this error if for some reason the deasync module wasn't installed
		throw new AsyncNotSupportedError({});
	}
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