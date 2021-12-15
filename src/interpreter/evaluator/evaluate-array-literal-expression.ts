import {EvaluatorOptions} from "./evaluator-options";
import {Literal} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {isIterable} from "../util/iterable/is-iterable";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ArrayLiteralExpression
 */
export function evaluateArrayLiteralExpression({node, environment, evaluate, typescript, statementTraversalStack}: EvaluatorOptions<TS.ArrayLiteralExpression>): Literal {
	// Get the Array constructor from the realm - not that of the executing context. Otherwise, instanceof checks would fail
	const arrayCtor = getFromLexicalEnvironment(node, environment, "Array")!.literal as ArrayConstructor;
	const value: Literal[] = arrayCtor.of();

	for (const element of node.elements) {
		const nextValue = evaluate.expression(element, environment, statementTraversalStack);
		if (typescript.isSpreadElement(element) && isIterable(nextValue)) {
			value.push(...nextValue);
		} else {
			value.push(nextValue);
		}
	}

	return value;
}
