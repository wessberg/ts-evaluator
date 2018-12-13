import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IPolicyErrorOptions} from "./i-policy-error-options";
import {IEvaluatePolicySanitized} from "../../policy/i-evaluate-policy";

/**
 * An Error that can be thrown when a policy is violated
 */
export class PolicyError extends EvaluationError {
	/**
	 * The kind of policy violation encountered
	 * @type {string}
	 */
	public readonly violation: keyof IEvaluatePolicySanitized;

	constructor ({violation, message}: IPolicyErrorOptions) {
		super({message: `[${violation}]: ${message}`});
		this.violation = violation;
	}
}