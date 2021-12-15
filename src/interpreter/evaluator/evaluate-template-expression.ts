import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a TemplateExpression
 */
export function evaluateTemplateExpression({node, environment, evaluate, statementTraversalStack}: EvaluatorOptions<TS.TemplateExpression>): Literal {
	let str = "";
	str += node.head.text;
	for (const span of node.templateSpans) {
		const expression = evaluate.expression(span.expression, environment, statementTraversalStack) as string;
		str += expression;
		str += span.literal.text;
	}
	return str;
}
