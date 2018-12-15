import {IEvaluatorOptions} from "./i-evaluator-options";
import {TemplateExpression} from "typescript";
import {Literal} from "../literal/literal";

/**
 * Evaluates, or attempts to evaluate, a TemplateExpression
 * @param {IEvaluatorOptions<TemplateExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateTemplateExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<TemplateExpression>): Literal {
	let str = "";
	str += node.head.text;
	for (const span of node.templateSpans) {
		const expression = (evaluate.expression(span.expression, environment, statementTraversalStack)) as string;
		str += expression;
		str += span.literal.text;
	}
	return str;
}