import {canBeObserved} from "../util/proxy/can-be-observed";
import {ICreatePolicyProxyOptions} from "./i-create-policy-proxy-options";
import {isBindCallApply} from "../util/function/is-bind-call-apply";
import {PolicyTrapKind} from "../policy/policy-trap-kind";

/**
 * Stringifies the given PropertyKey path
 * @param {PropertyKey[]} path
 * @return {string}
 */
function stringifyPath (path: PropertyKey[]): string {
	return path
		.map(part => typeof part === "symbol" ? part.description : part)
		.join(".");
}

/**
 * Creates a proxy with hooks to check the given policy
 * @param {ICreatePolicyProxyOptions<T>} options
 * @return {T}
 */
export function createPolicyProxy<T extends object> ({hook, item, scope, policy}: ICreatePolicyProxyOptions<T, object>): T {

	/**
	 * Creates a trap that captures function invocation
	 * @param {string[]} inputPath
	 * @param {U} currentItem
	 * @return {U}
	 */
	function createAccessTrap<U extends object> (inputPath: PropertyKey[], currentItem: U): U {
		return !canBeObserved(currentItem) || isBindCallApply(currentItem as Function) ? currentItem : new Proxy(currentItem, {

			/**
			 * Constructs a new instance of the given target
			 * @param {U} target
			 * @param {unknown[]} argArray
			 * @param newTarget
			 * @return {object}
			 */
			construct (target: U, argArray: unknown[], newTarget?: unknown): object {
				hook({
					kind: PolicyTrapKind.CONSTRUCT,
					policy,
					newTarget,
					argArray,
					target,
					path: stringifyPath(inputPath)
				});

				return Reflect.construct(<Function>target, argArray, newTarget);
			},

			/**
			 * A trap for a function call. Used to create new proxies for methods on the retrieved module objects
			 * @param {NodeRequire} target
			 * @param thisArg
			 * @param {unknown[]} argArray
			 * @return {unknown}
			 */
			apply (target: U, thisArg: unknown, argArray: unknown[] = []): unknown {
				hook({
					kind: PolicyTrapKind.APPLY,
					policy,
					thisArg,
					argArray,
					target,
					path: stringifyPath(inputPath)
				});
				return Reflect.apply(<Function>target, thisArg, argArray);
			},

			/**
			 * Gets a trap for 'get' accesses
			 * @param {U} target
			 * @param {string} property
			 * @param receiver
			 * @return {unknown}
			 */
			get (target: U, property: string, receiver: unknown): unknown {
				const newPath = [...inputPath, property];

				hook({
					kind: PolicyTrapKind.GET,
					policy,
					path: stringifyPath(newPath),
					target
				});

				const match = Reflect.get(target, property, receiver);

				const config = Reflect.getOwnPropertyDescriptor(currentItem, property);
				if (config != null && config.configurable === false && config.writable === false) {
					return currentItem[property as keyof U];
				}

				return createAccessTrap(newPath, match);
			}
		});
	}

	return !canBeObserved(item) ? item : createAccessTrap([scope], item);
}