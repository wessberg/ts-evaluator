import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IAsyncNotSupportedErrorOptions} from "./i-async-not-supported-error-options";
import {createEmptyStatement} from "typescript";

/**
 * An Error that can be thrown when an async operation is attempted but can't be computed
 */
export class AsyncNotSupportedError extends EvaluationError {

	constructor ({message = `It is not possible to evaluate asynchronously: Optional dependency 'deasync' must be installed.'`}: IAsyncNotSupportedErrorOptions) {
		super({message, node: createEmptyStatement()});
	}
}