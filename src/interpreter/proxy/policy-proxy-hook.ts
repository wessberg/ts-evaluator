/* eslint-disable @typescript-eslint/ban-types */
import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import {PolicyTrapKind} from "../policy/policy-trap-kind.js";

export interface IPolicyProxyHookOptions {
	kind: PolicyTrapKind;
	policy: EvaluatePolicySanitized;
	path: string;
}

export interface IPolicyProxyGetHookOptions<T extends object> extends IPolicyProxyHookOptions {
	kind: PolicyTrapKind.GET;
	target: T;
}

export interface IPolicyProxyConstructHookOptions<T extends object> extends IPolicyProxyHookOptions {
	kind: PolicyTrapKind.CONSTRUCT;
	target: T;
	argArray: unknown[];
	newTarget: unknown | undefined;
}

export interface IPolicyProxyApplyHookOptions<T extends object> extends IPolicyProxyHookOptions {
	kind: PolicyTrapKind.APPLY;
	target: T;
	thisArg: unknown;
	argArray: unknown[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PolicyProxyHookOptions<T extends Record<string, any>> = IPolicyProxyGetHookOptions<T> | IPolicyProxyApplyHookOptions<T> | IPolicyProxyConstructHookOptions<T>;
export type PolicyProxyHook<T extends object> = (options: PolicyProxyHookOptions<T>) => boolean;
