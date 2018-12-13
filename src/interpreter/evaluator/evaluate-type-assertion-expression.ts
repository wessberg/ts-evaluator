import {IEvaluatorOptions} from "./i-evaluator-options";
import {TypeAssertion} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a TypeAssertion
 * @param {IEvaluatorOptions<TypeAssertion>} options
 * @returns {Literal}
 */
export function evaluateTypeAssertion ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TypeAssertion>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}