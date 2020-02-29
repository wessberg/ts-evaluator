import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a TypeAssertion
 */
export function evaluateTypeAssertion({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TS.TypeAssertion>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
