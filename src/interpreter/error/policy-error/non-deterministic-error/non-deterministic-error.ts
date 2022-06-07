import {INonDeterministicErrorOptions} from "./i-non-deterministic-error-options.js";
import {PolicyError} from "../policy-error.js";

/**
 * An Error that can be thrown when something nondeterministic is attempted to be evaluated and has been disallowed to be so
 */
export class NonDeterministicError extends PolicyError {
	/**
	 * The kind of operation that was attempted to be performed but was in violation of the policy
	 */
	readonly operation: string;

	constructor({operation, node, message = `The operation: '${operation}' is nondeterministic. That is in violation of the policy`}: INonDeterministicErrorOptions) {
		super({violation: "deterministic", message, node});

		this.operation = operation;
	}
}
