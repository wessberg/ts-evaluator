/* eslint-disable @typescript-eslint/ban-types */
import {canBeObserved} from "../util/proxy/can-be-observed.js";
import {ICreatePolicyProxyOptions} from "./i-create-policy-proxy-options.js";
import {isBindCallApply} from "../util/function/is-bind-call-apply.js";
import {PolicyTrapKind} from "../policy/policy-trap-kind.js";
import {EvaluationErrorIntent, isEvaluationErrorIntent} from "../error/evaluation-error/evaluation-error-intent.js";
import { isEvaluationError } from "../error/evaluation-error/evaluation-error.js";

/**
 * Stringifies the given PropertyKey path
 */
function stringifyPath(path: PropertyKey[]): string {
	return path.map(part => (typeof part === "symbol" ? part.description : part)).join(".");
}

/**
 * Creates a proxy with hooks to check the given policy
 */
export function createPolicyProxy<T extends object>({hook, item, scope, policy}: ICreatePolicyProxyOptions<T, object>): T {
	/**
	 * Creates a trap that captures function invocation
	 */
	function createAccessTrap<U extends object>(inputPath: PropertyKey[], currentItem: U): U {
		const handleHookResult = (result: boolean | EvaluationErrorIntent, successCallback: CallableFunction) => {
			if (result === false) return;
			if (isEvaluationErrorIntent(result) || isEvaluationError(result)) return result;
			return successCallback();
		};

		return !canBeObserved(currentItem) || isBindCallApply(currentItem as Function)
			? currentItem
			: new Proxy(currentItem, {
					/**
					 * Constructs a new instance of the given target
					 */
					construct(target: U, argArray: unknown[], newTarget?: Function): object {
						return handleHookResult(
							hook({
								kind: PolicyTrapKind.CONSTRUCT,
								policy,
								newTarget,
								argArray,
								target,
								path: stringifyPath(inputPath)
							}),
							() => Reflect.construct(target as Function, argArray, newTarget)
						);
					},

					/**
					 * A trap for a function call. Used to create new proxies for methods on the retrieved module objects
					 */
					apply(target: U, thisArg: unknown, argArray: unknown[] = []): unknown {
						return handleHookResult(
							hook({
								kind: PolicyTrapKind.APPLY,
								policy,
								thisArg,
								argArray,
								target,
								path: stringifyPath(inputPath)
							}),
							() => Reflect.apply(target as Function, thisArg, argArray)
						);
					},

					/**
					 * Gets a trap for 'get' accesses
					 */
					get(target: U, property: string, receiver: unknown): unknown {
						const newPath = [...inputPath, property];
						return handleHookResult(
							hook({
								kind: PolicyTrapKind.GET,
								policy,
								path: stringifyPath(newPath),
								target
							}),
							() => {
								const match = Reflect.get(target, property, receiver);

								const config = Reflect.getOwnPropertyDescriptor(currentItem, property);
								if (config != null && config.configurable === false && config.writable === false) {
									return currentItem[property as keyof U];
								}
								return createAccessTrap(newPath, match);
							}
						);
					}
			  });
	}

	return !canBeObserved(item) ? item : createAccessTrap([scope], item);
}
