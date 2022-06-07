import {EvaluatorOptions} from "./evaluator-options.js";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a ReturnStatement
 */
export function evaluateReturnStatement({node, environment, evaluate, stack, reporting, statementTraversalStack}: EvaluatorOptions<TS.ReturnStatement>): void {
	setInLexicalEnvironment({env: environment, path: RETURN_SYMBOL, value: true, reporting, node});

	// If it is a simple 'return', return undefined
	if (node.expression == null) {
		stack.push(undefined);
	} else {
		stack.push(evaluate.expression(node.expression, environment, statementTraversalStack));
	}
}
