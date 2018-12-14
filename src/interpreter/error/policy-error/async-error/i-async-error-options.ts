import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";
import {IEvaluateAsyncPolicy} from "../../../policy/i-evaluate-policy";

export interface IAsyncErrorOptions extends IEvaluationErrorOptions {
	kind: keyof IEvaluateAsyncPolicy;
}