import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import {IUndefinedLeftValueErrorOptions} from "./i-undefined-left-value-error-options.js";

/**
 * An Error that can be thrown when an undefined leftValue is encountered
 */
export class UndefinedLeftValueError extends EvaluationError {
	constructor({node, environment, message = `'No leftValue could be determined'`}: IUndefinedLeftValueErrorOptions) {
		super({message, environment, node});
	}
}
