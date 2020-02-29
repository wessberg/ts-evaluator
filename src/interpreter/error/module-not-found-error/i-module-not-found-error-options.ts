import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";

export interface IModuleNotFoundErrorOptions extends IEvaluationErrorOptions {
	path: string;
}
