// noinspection JSUnusedGlobalSymbols
/**
 * Prints the given Node
 * @param {T} node
 * @param {string[]} properties
 */
export function printWithDeepRemovedProperties<T extends object> (node: T|undefined, ...properties: string[]): void {
	if (node === undefined) return console.log(undefined);
	if (properties.length === 0) return console.log(node);

	console.log(deepCloneWithRemovedProperty(node, properties as (keyof T)[]));
}

/**
 * Deep-clones the given object, and removes the provided property names along the way
 * from property values
 * @param {T} obj
 * @param {keyof T} properties
 * @param {Set<{}>} [seenNestedObjects]
 * @return {U}
 */
function deepCloneWithRemovedProperty<T extends object, U> (obj: T, properties: (keyof T)[], seenNestedObjects: Set<{}> = new Set()): U {
	if (seenNestedObjects.has(obj)) return "[Circular]" as unknown as U;

	seenNestedObjects.add(obj);
	const shallowClone = Array.isArray(obj) ? [...obj] : {...obj};
	properties.forEach(property => delete (shallowClone as T)[property]);

	if (Array.isArray(shallowClone)) {
		shallowClone.forEach((item, index) => {
			if (typeof item === "object" && item != null) {
				shallowClone[index] = deepCloneWithRemovedProperty(item, properties, seenNestedObjects);
			}

			else {
				shallowClone[index] = item;
			}
		});
	}

	else {
		Object.entries(shallowClone).forEach(([key, value]) => {
			if (typeof value === "object" && value != null) {
				shallowClone[key as keyof T] = deepCloneWithRemovedProperty(value, properties, seenNestedObjects);
			}

			else {
				shallowClone[key as keyof T] = value;
			}
		});
	}
	return shallowClone as unknown as U;
}