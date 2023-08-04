import type {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";
import type {EvaluateIOPolicy} from "../../../policy/evaluate-policy.js";

export interface IIoErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateIOPolicy;
}
