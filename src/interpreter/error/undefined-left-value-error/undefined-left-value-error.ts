import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IUndefinedLeftValueErrorOptions} from "./i-undefined-left-value-error-options";

/**
 * An Error that can be thrown when an undefined leftValue is encountered
 */
export class UndefinedLeftValueError extends EvaluationError {

	constructor ({node, message = `'No leftValue could be determined'`}: IUndefinedLeftValueErrorOptions) {
		super({message, node});
	}
}