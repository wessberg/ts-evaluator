import {IEvaluatorOptions} from "./i-evaluator-options";
import {pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a CaseClause, based on a switch expression
 */
export function evaluateCaseClause ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<TS.CaseClause>, switchExpression: Literal): void {
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