import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";

export interface IModuleNotFoundErrorOptions extends IEvaluationErrorOptions {
	path: string;
}
