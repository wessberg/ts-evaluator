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
import {ICreateSanitizedEnvironmentOptions} from "./i-create-sanitized-environment-options";
import {isConsoleOperation} from "../policy/console/is-console-operation";

// tslint:disable:no-any

/**
 * Creates an environment that provide hooks into policy checks
 * @param {ICreateSanitizedEnvironmentOptions} options
 * @return {IndexLiteral}
 */
export function createSanitizedEnvironment ({policy, env, getCurrentNode}: ICreateSanitizedEnvironmentOptions): IndexLiteral {

	const hook = (item: PolicyProxyHookOptions<any>) => {

		if (!policy.console && isConsoleOperation(item)) {
			return false;
		}

		if (!policy.io.read && isIoRead(item)) {
			throw new IoError({kind: "read", node: getCurrentNode()});
		}

		if (!policy.io.write && isIoWrite(item)) {
			throw new IoError({kind: "write", node: getCurrentNode()});
		}

		if (!policy.process.exit && isProcessExitOperation(item)) {
			throw new ProcessError({kind: "exit", node: getCurrentNode()});
		}

		if (!policy.process.exit && isProcessSpawnChildOperation(item)) {
			throw new ProcessError({kind: "spawnChild", node: getCurrentNode()});
		}

		if (!policy.network && isNetworkOperation(item)) {
			throw new NetworkError({operation: stringifyPolicyTrapKindOnPath(item.kind, item.path), node: getCurrentNode()});
		}

		if (policy.deterministic && isNonDeterministic(item)) {
			throw new NonDeterministicError({operation: stringifyPolicyTrapKindOnPath(item.kind, item.path), node: getCurrentNode()});
		}

		return true;
	};

	const descriptors = Object.entries(Object.getOwnPropertyDescriptors(env));
	const gettersAndSetters = Object.assign({}, ...descriptors
		.filter(([_, descriptor]) => !("value" in descriptor))
		.map(([name, descriptor]) => ({[name]: descriptor}))
	);

	const values = Object.assign({}, ...descriptors
		.filter(([_, descriptor]) => "value" in descriptor)
		.map(([name, descriptor]) => ({
			[name]: name === "require" ? new Proxy(descriptor.value as NodeRequire, {

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
				})
				: createPolicyProxy({
					policy,
					item: descriptor.value as object,
					scope: name,
					hook
				})
		})));

	return Object.defineProperties(values, {
		...gettersAndSetters
	});
}