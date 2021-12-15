import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {EvaluatePolicySanitized} from "../../policy/evaluate-policy";

export interface IPolicyErrorOptions extends IEvaluationErrorOptions {
	violation: keyof EvaluatePolicySanitized;
}
