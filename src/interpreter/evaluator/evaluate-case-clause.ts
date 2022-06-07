import {EvaluatorOptions} from "./evaluator-options.js";
import {pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {Literal} from "../literal/literal.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a CaseClause, based on a switch expression
 */
export function evaluateCaseClause({node, evaluate, environment, statementTraversalStack}: EvaluatorOptions<TS.CaseClause>, switchExpression: Literal): void {
	const expressionResult = evaluate.expression(node.expression, environment, statementTraversalStack);
	// Stop immediately if the expression doesn't match the switch expression
	if (expressionResult !== switchExpression) return;

	for (const statement of node.statements) {
		evaluate.statement(statement, environment);

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, environment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
