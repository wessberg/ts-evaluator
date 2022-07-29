import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {MaxOpDurationExceededError} from "../error/policy-error/max-op-duration-exceeded-error/max-op-duration-exceeded-error.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 */
export async function evaluateAwaitExpression(options: EvaluatorOptions<TS.AwaitExpression>): Promise<Literal> {
	const {node, environment, evaluate, policy, throwError, getCurrentError} = options;
	// If a maximum duration for any operation is given, set a timeout that will throw a PolicyError when and if the duration is exceeded.
	const timeout =
		policy.maxOpDuration === Infinity
			? undefined
			: setTimeout(() => {
					throwError(new MaxOpDurationExceededError({duration: policy.maxOpDuration, node, environment}));
			  }, policy.maxOpDuration);

	const result = evaluate.expression(node.expression, options) as Promise<Literal>;

	// Make sure to clear the timeout if it exists to avoid throwing unnecessarily
	if (timeout != null) clearTimeout(timeout);

	if (getCurrentError() != null) {
		return;
	}

	// Return the evaluated result
	return result;
}
