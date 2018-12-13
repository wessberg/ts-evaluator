import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {IEvaluatePolicySanitized} from "../../policy/i-evaluate-policy";

export interface IPolicyErrorOptions extends IEvaluationErrorOptions {
	violation: keyof IEvaluatePolicySanitized;
}