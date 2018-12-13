import {Node, SyntaxKind} from "typescript";
import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IUnexpectedNodeErrorOptions} from "./i-unexpected-node-error-options";

/**
 * An Error that can be thrown when an unexpected node is encountered
 */
export class UnexpectedNodeError extends EvaluationError {
	/**
	 * The node that was unexpected in the context that spawned this error
	 */
	public readonly node: Node;

	constructor ({node, message = `Unexpected Node: '${SyntaxKind[node.kind]}'`}: IUnexpectedNodeErrorOptions) {
		super({message});
		this.node = node;
	}
}