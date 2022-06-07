import {IEvaluationErrorOptions} from "./i-evaluation-error-options.js";
import {TS} from "../../../type/ts.js";

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
