import type {INetworkErrorOptions} from "./i-network-error-options.js";
import {PolicyError} from "../policy-error.js";

/**
 * An Error that can be thrown when a network operation is attempted to be executed that is in violation of the context policy
 */
export class NetworkError extends PolicyError {
	/**
	 * The kind of operation that was attempted to be performed but was in violation of the policy
	 */
	readonly operation: string;

	constructor({operation, node, environment, message = `The operation: '${operation}' is performing network activity. That is in violation of the policy`}: INetworkErrorOptions) {
		super({violation: "deterministic", message, node, environment});

		this.operation = operation;
	}
}
