import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {isIterable} from "../util/iterable/is-iterable.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ArrayLiteralExpression
 */
export function evaluateArrayLiteralExpression(options: EvaluatorOptions<TS.ArrayLiteralExpression>): Literal {
	const {node, environment, evaluate, typescript, getCurrentError} = options;
	// Get the Array constructor from the realm - not that of the executing context. Otherwise, instanceof checks would fail
	const arrayCtor = getFromLexicalEnvironment(node, environment, "Array")!.literal as ArrayConstructor;
	const value: Literal[] = arrayCtor.of();

	for (const element of node.elements) {
		const nextValue = evaluate.expression(element, options);
		if (getCurrentError() != null) {
			return;
		}

		if (typescript.isSpreadElement(element) && isIterable(nextValue)) {
			value.push(...nextValue);
		} else {
			value.push(nextValue);
		}
	}

	return value;
}
