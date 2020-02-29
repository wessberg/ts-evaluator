import {IEvaluationErrorOptions} from "./i-evaluation-error-options";
import {TS} from "../../../type/ts";

/**
 * A Base class for EvaluationErrors
 */
export class EvaluationError extends Error {
	/**
	 * The node that caused or thew the error
	 */
	readonly node: TS.Node;

	constructor({node, message}: IEvaluationErrorOptions) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.node = node;
	}
}
