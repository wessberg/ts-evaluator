import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import {IndexLiteral} from "../literal/literal.js";

export interface ICreateSanitizedEnvironmentOptions {
	policy: EvaluatePolicySanitized;
	env: IndexLiteral;
}
