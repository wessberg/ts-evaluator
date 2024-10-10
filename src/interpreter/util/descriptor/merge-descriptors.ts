/**
 * Merges all of the given descriptors
 */
export function mergeDescriptors<A extends object>(a: A): A;
export function mergeDescriptors<A extends object, B extends object>(a: A, b: B): A & B;
export function mergeDescriptors<A extends object, B extends object, C extends object>(a: A, b: B, c: C): A & B & C;
export function mergeDescriptors<A extends object, B extends object, C extends object>(a: A, b?: B, c?: C): A & B & C {
	const newObj = {} as A & B & C;
	const normalizedB = b ?? {};
	const normalizedC = c ?? {};
	[a, normalizedB, normalizedC].forEach(item => Object.defineProperties(newObj, Object.getOwnPropertyDescriptors(item)));
	return newObj;
}
