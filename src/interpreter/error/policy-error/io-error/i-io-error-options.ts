import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {EvaluateIOPolicy} from "../../../policy/evaluate-policy";

export interface IIoErrorOptions extends IEvaluationErrorOptions {
	kind: keyof EvaluateIOPolicy;
}
