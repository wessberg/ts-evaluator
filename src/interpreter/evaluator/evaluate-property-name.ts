import type {EvaluatorOptions} from "./evaluator-options.js";
import type {IndexLiteralKey, Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a PropertyName
 */
export function evaluatePropertyName({node, evaluate, typescript, ...options}: EvaluatorOptions<TS.PropertyName>): Literal {
	return (
		typescript.isComputedPropertyName(node)
			? evaluate.expression(node.expression, options)
			: typescript.isIdentifier(node) || typescript.isPrivateIdentifier?.(node)
			? node.text
			: evaluate.expression(node as TS.StringLiteral | TS.NumericLiteral, options)
	) as IndexLiteralKey;
}
