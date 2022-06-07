import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import {EvaluatePolicySanitized} from "../../policy/evaluate-policy.js";

export interface IPolicyErrorOptions extends IEvaluationErrorOptions {
	violation: keyof EvaluatePolicySanitized;
}
