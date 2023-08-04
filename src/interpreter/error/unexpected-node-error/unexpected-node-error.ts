import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import type {IUnexpectedNodeErrorOptions} from "./i-unexpected-node-error-options.js";

/**
 * An Error that can be thrown when an unexpected node is encountered
 */
export class UnexpectedNodeError extends EvaluationError {
	constructor({node, environment, typescript, message = `Unexpected Node: '${typescript.SyntaxKind[node.kind]}'`}: IUnexpectedNodeErrorOptions) {
		super({message, node, environment});
	}
}
