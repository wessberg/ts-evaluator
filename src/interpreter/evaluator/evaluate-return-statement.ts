import {EvaluatorOptions} from "./evaluator-options.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ReturnStatement
 */
export function evaluateReturnStatement({node, evaluate, stack, ...options}: EvaluatorOptions<TS.ReturnStatement>): void {
	const {getCurrentError} = options;
	setInLexicalEnvironment({...options, environment: options.environment, path: RETURN_SYMBOL, value: true, node});

	// If it is a simple 'return', return undefined
	if (node.expression == null) {
		stack.push(undefined);
	} else {
		const result = evaluate.expression(node.expression, options);

		if (getCurrentError() != null) {
			return;
		}
		stack.push(result);
	}
}
