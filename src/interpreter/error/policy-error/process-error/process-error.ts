import {IProcessErrorOptions} from "./i-process-error-options.js";
import {PolicyError} from "../policy-error.js";
import {EvaluateProcessPolicy} from "../../../policy/evaluate-policy.js";

/**
 * An Error that can be thrown when a Process operation is attempted to be executed that is in violation of the context policy
 */
export class ProcessError extends PolicyError {
	/**
	 * The kind of process operation that was violated
	 */
	readonly kind: keyof EvaluateProcessPolicy;

	constructor({kind, node, message = `${kind} operations are in violation of the policy`}: IProcessErrorOptions) {
		super({violation: "process", message, node});
		this.kind = kind;
	}
}
