import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IUndefinedIdentifierErrorOptions} from "./i-undefined-identifier-error-options";
import {TS} from "../../../type/ts";

/**
 * An Error that can be thrown when an undefined identifier is encountered
 */
export class UndefinedIdentifierError extends EvaluationError {
	/**
	 * The identifier that is undefined in the context that created this error
	 */
	readonly node: TS.Identifier | TS.PrivateIdentifier;

	constructor({node, message = `'${node.text}' is not defined'`}: IUndefinedIdentifierErrorOptions) {
		super({message, node});
	}
}
