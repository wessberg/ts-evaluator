import {IEvaluationErrorOptions} from "./i-evaluation-error-options";
import {Node} from "typescript";

/**
 * A Base class for EvaluationErrors
 */
export class EvaluationError extends Error {
	/**
	 * The node that caused or thew the error
	 */
	public readonly node: Node;

	constructor ({node, message}: IEvaluationErrorOptions) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.node = node;
	}
}