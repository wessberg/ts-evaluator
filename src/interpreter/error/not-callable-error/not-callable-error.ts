import {EvaluationError} from "../evaluation-error/evaluation-error";
import {INotCallableErrorOptions} from "./i-not-callable-error-options";
import {Literal, stringifyLiteral} from "../../literal/literal";

/**
 * An Error that can be thrown when a value is attempted to be called, but isn't callable
 */
export class NotCallableError extends EvaluationError {
	/**
	 * The non-callable value
	 * @type {Literal}
	 */
	public readonly value: Literal;

	constructor ({value, message = `${stringifyLiteral(value)} is not a function'`}: INotCallableErrorOptions) {
		super({message});
		this.value = value;
	}
}