import {IIoErrorOptions} from "./i-io-error-options";
import {PolicyError} from "../policy-error";
import {IEvaluateIOPolicy} from "../../../policy/i-evaluate-policy";

/**
 * An Error that can be thrown when an IO operation is attempted to be executed that is in violation of the context policy
 */
export class IoError extends PolicyError {
	/**
	 * The kind of IO operation that was violated
	 * @type {keyof IEvaluateIOPolicy}
	 */
	public readonly kind: keyof IEvaluateIOPolicy;

	constructor ({kind, message = `${kind} operations are in violation of the policy`}: IIoErrorOptions) {
		super({violation: "io", message});
		this.kind = kind;
	}
}