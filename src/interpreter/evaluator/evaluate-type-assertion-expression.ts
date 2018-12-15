import {IEvaluatorOptions} from "./i-evaluator-options";
import {TypeAssertion} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a TypeAssertion
 * @param {IEvaluatorOptions<TypeAssertion>} options
 * @returns {Promise<Literal>}
 */
export async function evaluateTypeAssertion ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TypeAssertion>): Promise<Literal> {
	return await evaluate.expression(node.expression, environment, statementTraversalStack);
}