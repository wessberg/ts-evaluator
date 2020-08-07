import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {PolicyProxyHook} from "./policy-proxy-hook";

// eslint-disable-next-line @typescript-eslint/ban-types
export interface ICreatePolicyProxyOptions<T extends object, U extends object> {
	item: T;
	scope: string;
	policy: IEvaluatePolicySanitized;
	hook: PolicyProxyHook<U>;
}
