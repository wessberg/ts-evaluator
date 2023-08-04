import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import type {IPolicyErrorOptions} from "./i-policy-error-options.js";
import type {EvaluatePolicySanitized} from "../../policy/evaluate-policy.js";

/**
 * An Error that can be thrown when a policy is violated
 */
export class PolicyError extends EvaluationError {
	/**
	 * The kind of policy violation encountered
	 */
	readonly violation: keyof EvaluatePolicySanitized;

	constructor({violation, node, environment, message}: IPolicyErrorOptions) {
		super({node, environment, message: `[${violation}]: ${message}`});
		this.violation = violation;
	}
}
