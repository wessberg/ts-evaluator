import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteralKey, Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a PropertyName
 */
export function evaluatePropertyName({environment, node, evaluate, typescript, statementTraversalStack}: EvaluatorOptions<TS.PropertyName>): Literal {
	return (
		typescript.isComputedPropertyName(node)
			? evaluate.expression(node.expression, environment, statementTraversalStack)
			: typescript.isIdentifier(node) || typescript.isPrivateIdentifier?.(node)
			? node.text
			: evaluate.expression(node as TS.StringLiteral | TS.NumericLiteral, environment, statementTraversalStack)
	) as IndexLiteralKey;
}
