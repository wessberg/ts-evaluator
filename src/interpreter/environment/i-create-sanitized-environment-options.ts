import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {IndexLiteral} from "../literal/literal";

export interface ICreateSanitizedEnvironmentOptions {
	policy: IEvaluatePolicySanitized;
	env: IndexLiteral;
}