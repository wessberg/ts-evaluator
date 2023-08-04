import type {EvaluatorOptions} from "./evaluator-options.js";
import {pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CaseClause, based on a switch expression
 */
export function evaluateCaseClause({node, evaluate, ...options}: EvaluatorOptions<TS.CaseClause>, switchExpression: Literal): void {
	const {getCurrentError} = options;
	const expressionResult = evaluate.expression(node.expression, options);
	// Stop immediately if the expression doesn't match the switch expression
	if (expressionResult !== switchExpression || getCurrentError() != null) return;

	for (const statement of node.statements) {
		evaluate.statement(statement, options);

		if (getCurrentError() != null) {
			return;
		}

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, options.environment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
