import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {MaxOpDurationExceededError} from "../error/policy-error/max-op-duration-exceeded-error/max-op-duration-exceeded-error";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, an AwaitExpression
 */
export async function evaluateAwaitExpression({
	node,
	environment,
	evaluate,
	policy,
	statementTraversalStack
}: IEvaluatorOptions<TS.AwaitExpression>): Promise<Literal> {
	// If a maximum duration for any operation is given, set a timeout that will throw a PolicyError when and if the duration is exceeded.
	const timeout =
		policy.maxOpDuration === Infinity
			? undefined
			: setTimeout(() => {
					throw new MaxOpDurationExceededError({duration: policy.maxOpDuration, node});
			  }, policy.maxOpDuration);

	const result = evaluate.expression(node.expression, environment, statementTraversalStack) as Promise<Literal>;

	// Make sure to clear the timeout if it exists to avoid throwing unnecessarily
	if (timeout != null) clearTimeout(timeout);

	// Return the evaluated result
	return result;
}
