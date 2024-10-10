import type {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import type {PolicyProxyHook} from "./policy-proxy-hook.js";

export interface ICreatePolicyProxyOptions<T extends object, U extends object> {
	item: T;
	scope: string;
	policy: EvaluatePolicySanitized;
	hook: PolicyProxyHook<U>;
}
