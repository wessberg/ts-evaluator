/**
 * Creates a proxy'ed require function
 * @return {NodeRequire}
 */
import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {isIoRead} from "../policy/io/is-io-read";
import {IoError} from "../error/policy-error/io-error/io-error";
import {isIoWrite} from "../policy/io/is-io-write";
import {createPolicyProxy} from "../proxy/create-policy-proxy";
import {PolicyTrapKind} from "../policy/policy-trap-kind";
import {PolicyProxyHookOptions} from "../proxy/policy-proxy-hook";
import {isNetworkOperation} from "../policy/network/is-network-operation";
import {NetworkError} from "../error/policy-error/network-error/network-error";
import {IBuiltInModuleMap} from "../policy/module/built-in-module-map";

/**
 * Creates a proxy'ed 'require()' function that can intercept calls based on the evaluation policy
 * @param {IEvaluatePolicySanitized} policy
 * @return {NodeRequire}
 */
export function createProxyRequire (policy: IEvaluatePolicySanitized): NodeRequire {

	return new Proxy(require, {

		/**
		 * A trap for a function call. Used to create new proxies for methods on the retrieved module objects
		 * @param {NodeRequire} target
		 * @param thisArg
		 * @param {unknown[]} argArray
		 * @return {unknown}
		 */
		apply (target: NodeRequire, thisArg: unknown, argArray: unknown[] = []): unknown {
			const [moduleName] = argArray as string[];

			return createPolicyProxy({
				policy,
				item: Reflect.apply(target, thisArg, argArray),
				scope: moduleName,
				hook: (item: PolicyProxyHookOptions<IBuiltInModuleMap>) => {

					if (!policy.io.read && isIoRead(item)) {
						throw new IoError({kind: "read"});
					}

					if (!policy.io.write && isIoWrite(item)) {
						throw new IoError({kind: "write"});
					}

					switch (item.kind) {
						case PolicyTrapKind.APPLY: {
							if (!policy.network && isNetworkOperation(item)) {
								throw new NetworkError({operation: `${item.path}(...)`});
							}

							break;
						}

						case PolicyTrapKind.CONSTRUCT: {
							if (!policy.network && isNetworkOperation(item)) {
								throw new NetworkError({operation: `new ${item.path}(...)`});
							}

							break;
						}

						case PolicyTrapKind.GET: {
							if (!policy.network && isNetworkOperation(item)) {
								throw new NetworkError({operation: `get ${item.path}`});
							}

							break;
						}
					}
				}
			});
		}
	});
}