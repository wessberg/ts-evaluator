import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";
import {EvaluateProcessPolicy} from "../../../policy/evaluate-policy.js";

export interface IProcessErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateProcessPolicy;
}
