import {EvaluatorOptions} from "./evaluator-options.js";
import {pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a DefaultClause, based on a switch expression
 */
export function evaluateDefaultClause({node, evaluate, environment}: EvaluatorOptions<TS.DefaultClause>): void {
	for (const statement of node.statements) {
		evaluate.statement(statement, environment);

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, environment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
