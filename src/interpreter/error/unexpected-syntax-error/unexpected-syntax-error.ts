import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import {IUnexpectedSyntaxErrorOptions} from "./i-unexpected-syntax-error-options.js";

/**
 * An Error that can be thrown when a certain usage is to be considered a SyntaxError
 */
export class UnexpectedSyntaxError extends EvaluationError {
	constructor({node, environment, message = `'SyntaxError'`}: IUnexpectedSyntaxErrorOptions) {
		super({message, environment, node});
	}
}
