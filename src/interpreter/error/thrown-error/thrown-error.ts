import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IThrownErrorOptions} from "./i-thrown-error-options";

/**
 * An Error that represents an error thrown from within the code that is being evaluated.
 */
export class ThrownError extends EvaluationError {
	/**
	 * The originally thrown Error
	 * @type {Error}
	 */
	public readonly originalError: Error;

	constructor ({originalError, node, message = originalError.message}: IThrownErrorOptions) {
		super({message, node});
		this.originalError = originalError;
	}
}