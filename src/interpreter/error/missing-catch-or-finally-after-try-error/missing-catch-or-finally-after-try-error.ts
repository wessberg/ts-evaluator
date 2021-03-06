import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IMissingCatchOrFinallyAfterTryErrorOptions} from "./i-missing-catch-or-finally-after-try-error-options";
import {TS} from "../../../type/ts";

/**
 * An Error that can be thrown when a TryStatement is encountered without neither a catch {...} nor a finally {...} block
 */
export class MissingCatchOrFinallyAfterTryError extends EvaluationError {
	/**
	 * The TryStatement that lacks a catch/finally block
	 */
	readonly node!: TS.TryStatement;

	constructor({node, message = `Missing catch or finally after try`}: IMissingCatchOrFinallyAfterTryErrorOptions) {
		super({node, message});
	}
}
