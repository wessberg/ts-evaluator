import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a TypeOfExpression
 */
export function evaluateTypeOfExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.TypeOfExpression>): Literal {
	return typeof evaluate.expression(node.expression, environment, statementTraversalStack);
}
