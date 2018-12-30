import {IEvaluatorOptions} from "./i-evaluator-options";
import {AwaitExpression} from "typescript";
import {Literal} from "../literal/literal";
import {syncAwait} from "../util/await/sync-await";
import {MaxOpDurationExceededError} from "../error/policy-error/max-op-duration-exceeded-error/max-op-duration-exceeded-error";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 * @param {IEvaluatorOptions<AwaitExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateAwaitExpression ({node, environment, evaluate, policy, statementTraversalStack}: IEvaluatorOptions<AwaitExpression>): Literal {
	// If a maximum duration for any operation is given, set a timeout that will throw a PolicyError when and if the duration is exceeded.
	const timeout = policy.maxOpDuration === Infinity
		? undefined
		: setTimeout(() => {
			throw new MaxOpDurationExceededError({duration: policy.maxOpDuration, node});
		}, policy.maxOpDuration);

	const result = syncAwait(evaluate.expression(node.expression, environment, statementTraversalStack) as Promise<Literal>);

	// Make sure to clear the timeout if it exists to avoid throwing unnecessarily
	if (timeout != null) clearTimeout(timeout);

	// Return the evaluated result
	return result;
}