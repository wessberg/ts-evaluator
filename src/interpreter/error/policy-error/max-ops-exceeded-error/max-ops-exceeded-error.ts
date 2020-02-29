import {IMaxOpsExceededErrorOptions} from "./i-max-ops-exceeded-error-options";
import {PolicyError} from "../policy-error";

/**
 * An Error that can be thrown when the maximum amount of operations dictated by the policy is exceeded
 */
export class MaxOpsExceededError extends PolicyError {
	/**
	 * The amount of operations performed before creating this error instance
	 */
	public readonly ops: number;

	constructor({ops, node, message = `Maximum ops exceeded: ${ops}`}: IMaxOpsExceededErrorOptions) {
		super({violation: "maxOps", message, node});
		this.ops = ops;
	}
}
