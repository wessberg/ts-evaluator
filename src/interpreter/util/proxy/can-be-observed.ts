/**
 * Returns true if the provided value is ObjectLike
 *
 * @param value
 * @returns
 */
export function isObjectLike<T> (value: T): boolean {
	return value != null && (typeof value === "function" || typeof value === "object");
}

/**
 * Returns true if the given value can be observed
 *
 * @param value
 * @returns
 */
export function canBeObserved<T> (value: T): boolean {
	return isObjectLike(value);
}