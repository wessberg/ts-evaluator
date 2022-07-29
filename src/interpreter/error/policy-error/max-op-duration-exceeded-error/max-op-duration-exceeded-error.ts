import {IMaxOpDurationExceededErrorOptions} from "./i-max-op-duration-exceeded-error-options.js";
import {PolicyError} from "../policy-error.js";

/**
 * An Error that can be thrown when the maximum amount of operations dictated by the policy is exceeded
 */
export class MaxOpDurationExceededError extends PolicyError {
	/**
	 * The total duration of an operation that was being performed before exceeding the limit
	 */
	readonly duration: number;

	constructor({duration, environment, node, message = `Maximum operation duration exceeded: ${duration}`}: IMaxOpDurationExceededErrorOptions) {
		super({violation: "maxOpDuration", message, node, environment});
		this.duration = duration;
	}
}
