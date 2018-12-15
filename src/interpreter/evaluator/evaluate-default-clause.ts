import {IEvaluatorOptions} from "./i-evaluator-options";
import {DefaultClause} from "typescript";
import {pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";

/**
 * Evaluates, or attempts to evaluate, a DefaultClause, based on a switch expression
 * @param {IEvaluatorOptions<DefaultClause>} options
 */
export async function evaluateDefaultClause ({node, evaluate, environment}: IEvaluatorOptions<DefaultClause>): Promise<void> {

	for (const statement of node.statements) {
		await evaluate.statement(statement, environment);

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(environment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}