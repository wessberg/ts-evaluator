import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";

export interface IThrownErrorOptions extends IEvaluationErrorOptions {
	originalError: Error;
}