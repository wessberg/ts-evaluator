/* eslint-disable @typescript-eslint/ban-types */

/**
 * Merges all of the given descriptors
 * @param {A} a
 * @return {A}
 */
export function mergeDescriptors<A extends object>(a: A): A;
export function mergeDescriptors<A extends object, B extends object>(a: A, b: B): A & B;
export function mergeDescriptors<A extends object, B extends object, C extends object>(a: A, b: B, c: C): A & B & C;
export function mergeDescriptors<A extends object, B extends object, C extends object>(a: A, b?: B, c?: C): A & B & C {
	const newObj = {} as A & B & C;
	const normalizedB = b == null ? {} : b;
	const normalizedC = c == null ? {} : c;
	[a, normalizedB, normalizedC].forEach(item => Object.defineProperties(newObj, Object.getOwnPropertyDescriptors(item)));
	return newObj;
}
