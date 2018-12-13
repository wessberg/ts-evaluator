/**
 * Returns true if the provided value is ObjectLike
 * @param {T} value
 * @returns {boolean}
 */
export function isObjectLike<T> (value: T): boolean {
	return value != null && (
		typeof value === "function" || Array.isArray(value) || value.constructor === {}.constructor
	);
}

/**
 * Returns true if the given value can be observed
 * @param {T} value
 * @returns {boolean}
 */
export function canBeObserved<T> (value: T): boolean {
	return isObjectLike(value);
}