import {IEvaluatorOptions} from "./i-evaluator-options";
import {ReturnStatement} from "typescript";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {RETURN_SYMBOL} from "../util/return/return-symbol";

/**
 * Evaluates, or attempts to evaluate, a ReturnStatement
 * @param {IEvaluatorOptions<ReturnStatement>} options
 */
export function evaluateReturnStatement ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<ReturnStatement>): void {
	setInLexicalEnvironment(environment, RETURN_SYMBOL, true);

	// If it is a simple 'return', return undefined
	if (node.expression == null) {
		stack.push(undefined);
	}

	else {
		stack.push(evaluate.expression(node.expression, environment, statementTraversalStack));
	}
}