import {EvaluatorOptions} from "./evaluator-options.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a TemplateExpression
 */
export function evaluateTemplateExpression({node, evaluate, ...options}: EvaluatorOptions<TS.TemplateExpression>): Literal {
	let str = "";
	str += node.head.text;
	for (const span of node.templateSpans) {
		const expression = evaluate.expression(span.expression, options) as string;

		if (options.getCurrentError() != null) {
			return;
		}

		str += expression;
		str += span.literal.text;
	}
	return str;
}
