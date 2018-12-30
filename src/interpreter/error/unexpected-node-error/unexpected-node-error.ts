import {SyntaxKind} from "typescript";
import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IUnexpectedNodeErrorOptions} from "./i-unexpected-node-error-options";

/**
 * An Error that can be thrown when an unexpected node is encountered
 */
export class UnexpectedNodeError extends EvaluationError {

	constructor ({node, message = `Unexpected Node: '${SyntaxKind[node.kind]}'`}: IUnexpectedNodeErrorOptions) {
		super({message, node});
	}
}