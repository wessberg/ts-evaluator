import {IIoErrorOptions} from "./i-io-error-options.js";
import {PolicyError} from "../policy-error.js";
import {EvaluateIOPolicy} from "../../../policy/evaluate-policy.js";

/**
 * An Error that can be thrown when an IO operation is attempted to be executed that is in violation of the context policy
 */
export class IoError extends PolicyError {
	/**
	 * The kind of IO operation that was violated
	 */
	readonly kind: keyof EvaluateIOPolicy;

	constructor({node, environment, kind, message = `${kind} operations are in violation of the policy`}: IIoErrorOptions) {
		super({violation: "io", message, environment, node});
		this.kind = kind;
	}
}
