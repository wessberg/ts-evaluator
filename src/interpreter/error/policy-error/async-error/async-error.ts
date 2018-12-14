import {IAsyncErrorOptions} from "./i-async-error-options";
import {PolicyError} from "../policy-error";
import {IEvaluateAsyncPolicy} from "../../../policy/i-evaluate-policy";

/**
 * An Error that can be thrown when an asynchronous operation is attempted to be executed that is in violation of the context policy
 */
export class AsyncError extends PolicyError {
	/**
	 * The kind of asynchronous operation that was violated
	 * @type {keyof IEvaluateIOPolicy}
	 */
	public readonly kind: keyof IEvaluateAsyncPolicy;

	constructor ({kind, message = `${kind} operations are in violation of the policy`}: IAsyncErrorOptions) {
		super({violation: "async", message});
		this.kind = kind;
	}
}