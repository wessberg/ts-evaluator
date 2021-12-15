import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {EvaluateProcessPolicy} from "../../../policy/evaluate-policy";

export interface IProcessErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateProcessPolicy;
}
