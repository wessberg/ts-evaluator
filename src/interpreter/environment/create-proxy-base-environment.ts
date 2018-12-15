import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {IndexLiteral} from "../literal/literal";
import {createPolicyProxy} from "../proxy/create-policy-proxy";
import {stringifyPolicyTrapKindOnPath} from "../policy/policy-trap-kind";
import {isNonDeterministic} from "../policy/nondeterministic/is-nondeterministic";
import {NonDeterministicError} from "../error/policy-error/non-deterministic-error/non-deterministic-error";
import {PolicyProxyHookOptions} from "../proxy/policy-proxy-hook";
import {isIoRead} from "../policy/io/is-io-read";
import {IoError} from "../error/policy-error/io-error/io-error";
import {isIoWrite} from "../policy/io/is-io-write";
import {isNetworkOperation} from "../policy/network/is-network-operation";
import {NetworkError} from "../error/policy-error/network-error/network-error";
import {isProcessExitOperation} from "../policy/process/is-process-exit-operation";
import {ProcessError} from "../error/policy-error/process-error/process-error";
import {isProcessSpawnChildOperation} from "../policy/process/is-process-spawn-child-operation";
import {BUILT_IN_NAMES} from "./built-in/built-in-names";

// tslint:disable:no-any


/**
 * Creates a proxy'ed ECMAScript and Node environment that can intercept calls based on the evaluation policy
 * @param {IEvaluatePolicySanitized} policy
 * @return {IndexLiteral}
 */
export function createProxyBaseEnvironment (policy: IEvaluatePolicySanitized): IndexLiteral {

	const hook = (item: PolicyProxyHookOptions<any>) => {

		if (!policy.io.read && isIoRead(item)) {
			throw new IoError({kind: "read"});
		}

		if (!policy.io.write && isIoWrite(item)) {
			throw new IoError({kind: "write"});
		}

		if (!policy.process.exit && isProcessExitOperation(item)) {
			throw new ProcessError({kind: "exit"});
		}

		if (!policy.process.exit && isProcessSpawnChildOperation(item)) {
			throw new ProcessError({kind: "spawnChild"});
		}

		if (!policy.network && isNetworkOperation(item)) {
			throw new NetworkError({operation: stringifyPolicyTrapKindOnPath(item.kind, item.path)});
		}

		if (policy.deterministic && isNonDeterministic(item)) {
			throw new NonDeterministicError({operation: stringifyPolicyTrapKindOnPath(item.kind, item.path)});
		}
	};

	return Object.assign(
		{},
		...BUILT_IN_NAMES
			.filter(name => {
				if (name === "undefined" || name === "null" || name === "require") return true;
				return name in global;
			})
			.map(name => ({
				[name]: name === "require" ? new Proxy(require, {

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
							hook
						});
					}
				}) : createPolicyProxy({
					policy,
					item: global[name as keyof typeof global],
					scope: name,
					hook
				})
			}))
	);
}