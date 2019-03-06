import {IEvaluatorOptions} from "./i-evaluator-options";
import {ArrayLiteralExpression, isSpreadElement} from "typescript";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {isIterable} from "../util/iterable/is-iterable";

/**
 * Evaluates, or attempts to evaluate, a ArrayLiteralExpression
 * @param {IEvaluatorOptions<ArrayLiteralExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluateArrayLiteralExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<ArrayLiteralExpression>): Literal {
	// Get the Array constructor from the realm - not that of the executing context. Otherwise, instanceof checks would fail
	const arrayCtor = getFromLexicalEnvironment(node, environment, "Array")!.literal as ArrayConstructor;
	const value: Literal[] = arrayCtor.of();

	for (const element of node.elements) {
		const nextValue = evaluate.expression(element, environment, statementTraversalStack);
		if (isSpreadElement(element) && isIterable(nextValue)) {
			value.push(...nextValue);
		}

		else {
			value.push(nextValue);
		}
	}

	return value;
}