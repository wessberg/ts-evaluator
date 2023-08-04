import type {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import type {IndexLiteral} from "../literal/literal.js";

export interface ICreateSanitizedEnvironmentOptions {
	policy: EvaluatePolicySanitized;
	env: IndexLiteral;
}
