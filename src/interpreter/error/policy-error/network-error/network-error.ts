import {INetworkErrorOptions} from "./i-network-error-options";
import {PolicyError} from "../policy-error";

/**
 * An Error that can be thrown when a network operation is attempted to be executed that is in violation of the context policy
 */
export class NetworkError extends PolicyError {
	/**
	 * The kind of operation that was attempted to be performed but was in violation of the policy
	 */
	readonly operation: string;

	constructor({
		operation,
		node,
		message = `The operation: '${operation}' is performing network activity. That is in violation of the policy`
	}: INetworkErrorOptions) {
		super({violation: "deterministic", message, node});

		this.operation = operation;
	}
}
