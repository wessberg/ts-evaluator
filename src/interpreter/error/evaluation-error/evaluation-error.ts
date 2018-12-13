import {IEvaluationErrorOptions} from "./i-evaluation-error-options";

/**
 * A Base class for EvaluationErrors
 */
export class EvaluationError extends Error {
	constructor ({message}: IEvaluationErrorOptions = {}) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
	}
}