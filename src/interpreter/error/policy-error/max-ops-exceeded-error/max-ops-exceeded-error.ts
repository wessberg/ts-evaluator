import {IMaxOpsExceededErrorOptions} from "./i-max-ops-exceeded-error-options.js";
import {PolicyError} from "../policy-error.js";

/**
 * An Error that can be thrown when the maximum amount of operations dictated by the policy is exceeded
 */
export class MaxOpsExceededError extends PolicyError {
	/**
	 * The amount of operations performed before creating this error instance
	 */
	readonly ops: number;

	constructor({ops, node, environment, message = `Maximum ops exceeded: ${ops}`}: IMaxOpsExceededErrorOptions) {
		super({violation: "maxOps", message, node, environment});
		this.ops = ops;
	}
}
