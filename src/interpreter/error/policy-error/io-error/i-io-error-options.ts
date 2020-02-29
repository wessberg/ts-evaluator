import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {IEvaluateIOPolicy} from "../../../policy/i-evaluate-policy";

export interface IIoErrorOptions extends IEvaluationErrorOptions {
	kind: keyof IEvaluateIOPolicy;
}
