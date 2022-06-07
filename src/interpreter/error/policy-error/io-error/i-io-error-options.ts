import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";
import {EvaluateIOPolicy} from "../../../policy/evaluate-policy.js";

export interface IIoErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateIOPolicy;
}
