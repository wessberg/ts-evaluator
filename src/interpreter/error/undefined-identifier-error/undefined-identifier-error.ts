import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import type {IUndefinedIdentifierErrorOptions} from "./i-undefined-identifier-error-options.js";
import type {TS} from "../../../type/ts.js";

/**
 * An Error that can be thrown when an undefined identifier is encountered
 */
export class UndefinedIdentifierError extends EvaluationError {
	/**
	 * The identifier that is undefined in the context that created this error
	 */
	readonly node!: TS.Identifier | TS.PrivateIdentifier;

	constructor({node, environment, message = `'${node.text}' is not defined'`}: IUndefinedIdentifierErrorOptions) {
		super({message, environment, node});
	}
}
