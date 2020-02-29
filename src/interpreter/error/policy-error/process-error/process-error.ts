import {IProcessErrorOptions} from "./i-process-error-options";
import {PolicyError} from "../policy-error";
import {IEvaluateProcessPolicy} from "../../../policy/i-evaluate-policy";

/**
 * An Error that can be thrown when a Process operation is attempted to be executed that is in violation of the context policy
 */
export class ProcessError extends PolicyError {
	/**
	 * The kind of process operation that was violated
	 * @type {keyof IEvaluateProcessPolicy}
	 */
	public readonly kind: keyof IEvaluateProcessPolicy;

	constructor({kind, node, message = `${kind} operations are in violation of the policy`}: IProcessErrorOptions) {
		super({violation: "process", message, node});
		this.kind = kind;
	}
}
