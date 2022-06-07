import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a TypeAssertion
 */
export function evaluateTypeAssertion({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.TypeAssertion>): Literal {
	return evaluate.expression(node.expression, environment, statementTraversalStack);
}
