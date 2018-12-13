import {Identifier} from "typescript";
import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IUndefinedIdentifierErrorOptions} from "./i-undefined-identifier-error-options";

/**
 * An Error that can be thrown when an undefined identifier is encountered
 */
export class UndefinedIdentifierError extends EvaluationError {
	/**
	 * The identifier that is undefined in the context that created this error
	 */
	public readonly identifier: Identifier;

	constructor ({identifier, message = `'${identifier.text}' is not defined'`}: IUndefinedIdentifierErrorOptions) {
		super({message});
		this.identifier = identifier;
	}
}