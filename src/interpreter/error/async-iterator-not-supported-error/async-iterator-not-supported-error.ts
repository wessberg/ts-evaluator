import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IAsyncIteratorNotSupportedErrorOptions} from "./i-async-iterator-not-supported-error-options";

/**
 * An Error that can be thrown when an async iteration operation is attempted
 */
export class AsyncIteratorNotSupportedError extends EvaluationError {
	constructor({message = `It is not possible to evaluate an async iterator'`, typescript}: IAsyncIteratorNotSupportedErrorOptions) {
		super({message, node: typescript.createEmptyStatement()});
	}
}
