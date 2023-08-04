import type {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";
import type {EvaluateProcessPolicy} from "../../../policy/evaluate-policy.js";

export interface IProcessErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateProcessPolicy;
}
