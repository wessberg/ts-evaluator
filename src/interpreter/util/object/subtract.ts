export type Subtract<T, K extends Partial<T>> = {
	[Key in Exclude<keyof T, keyof K>]: T[Key];
};

/**
 * Excludes the properties of B from A
 * @param {A} a
 * @param {B} b
 * @return {Exclude<A, B>}
 */
export function subtract<A extends object, B extends Partial<A>> (a: A, b: B): Subtract<A, B> {
	const newA = {} as Exclude<A, keyof B>;
	Object.getOwnPropertyNames(a).forEach((name) => {
		if (!(name in b)) {
			Object.defineProperty(newA, name, Object.getOwnPropertyDescriptor(a, name)!);
		}
	});
	return newA;
}