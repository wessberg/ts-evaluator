import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {IEvaluateProcessPolicy} from "../../../policy/i-evaluate-policy";

export interface IProcessErrorOptions extends IEvaluationErrorOptions {
	kind: keyof IEvaluateProcessPolicy;
}