import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {IndexLiteral} from "../literal/literal";
import {createPolicyProxy} from "../proxy/create-policy-proxy";
import {PolicyTrapKind} from "../policy/policy-trap-kind";
import {isNonDeterministic} from "../policy/nondeterministic/is-nondeterministic";
import {NonDeterministicError} from "../error/policy-error/non-deterministic-error/non-deterministic-error";
import {PolicyProxyHookOptions} from "../proxy/policy-proxy-hook";

const ECMA_BUILT_IN_NAMES = [
	"Infinity",
	"NaN",
	"undefined",
	"isFinite",
	"isNaN",
	"parseFloat",
	"parseInt",
	"decodeURI",
	"decodeURIComponent",
	"encodeURI",
	"encodeURIComponent",
	"Array",
	"ArrayBuffer",
	"Boolean",
	"DataView",
	"Date",
	"Error",
	"EvalError",
	"Float32Array",
	"Float64Array",
	"Int8Array",
	"Int16Array",
	"Int32Array",
	"Map",
	"Number",
	"Object",
	"Promise",
	"Proxy",
	"RangeError",
	"ReferenceError",
	"RegExp",
	"Set",
	"String",
	"Symbol",
	"SyntaxError",
	"TypeError",
	"Uint8Array",
	"Uint8ClampedArray",
	"Uint16Array",
	"Uint32Array",
	"URIError",
	"WeakMap",
	"WeakSet",
	"JSON",
	"Math",
	"Reflect",
	"escape",
	"unescape",
	"Intl",
	"Realm",
	"eval",
	"Function",
	"BigInt",
	"fetch"
];

/**
 * Creates a proxy'ed ECMAScript environment that can intercept calls based on the evaluation policy
 * @param {IEvaluatePolicySanitized} policy
 * @return {IndexLiteral}
 */
export function createProxyEcmaEnvironment (policy: IEvaluatePolicySanitized): IndexLiteral {

	return Object.assign(
		{},
		...ECMA_BUILT_IN_NAMES
			.filter(name => name in global)
			.map(name => ({
				[name]: createPolicyProxy({
					policy,
					item: global[name as keyof typeof global],
					scope: name,
					hook: (item: PolicyProxyHookOptions<typeof global>) => {
						switch (item.kind) {
							case PolicyTrapKind.GET:
								if (isNonDeterministic(item)) {
									throw new NonDeterministicError({operation: `get ${item.path}`});
								}
								break;

							case PolicyTrapKind.APPLY:
								if (isNonDeterministic(item)) {
									throw new NonDeterministicError({operation: `${item.path}(...)`});
								}
								break;

							case PolicyTrapKind.CONSTRUCT:
								if (isNonDeterministic(item)) {
									throw new NonDeterministicError({operation: `new ${item.path}(...)`});
								}
								break;
						}
					}
				})
			}))
	);
}