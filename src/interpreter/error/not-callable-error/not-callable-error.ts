import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import {INotCallableErrorOptions} from "./i-not-callable-error-options.js";
import {Literal, stringifyLiteral} from "../../literal/literal.js";

/**
 * An Error that can be thrown when a value is attempted to be called, but isn't callable
 */
export class NotCallableError extends EvaluationError {
	/**
	 * The non-callable value
	 */
	readonly value: Literal;

	constructor({value, node, environment, message = `${stringifyLiteral(value)} is not a function'`}: INotCallableErrorOptions) {
		super({message, environment, node});
		this.value = value;
	}
}
