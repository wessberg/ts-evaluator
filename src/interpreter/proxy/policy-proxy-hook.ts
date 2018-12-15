import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {PolicyTrapKind} from "../policy/policy-trap-kind";

export interface IPolicyProxyHookOptions {
	kind: PolicyTrapKind;
	policy: IEvaluatePolicySanitized;
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
	newTarget: unknown|undefined;
}

export interface IPolicyProxyApplyHookOptions<T extends object> extends IPolicyProxyHookOptions {
	kind: PolicyTrapKind.APPLY;
	target: T;
	thisArg: unknown;
	argArray: unknown[];
}

export type PolicyProxyHookOptions<T extends Object> = IPolicyProxyGetHookOptions<T> | IPolicyProxyApplyHookOptions<T> | IPolicyProxyConstructHookOptions<T>;
export type PolicyProxyHook<T extends object> = (options: PolicyProxyHookOptions<T>) => boolean;