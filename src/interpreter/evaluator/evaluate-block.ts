import {IEvaluatorOptions} from "./i-evaluator-options";
import {LexicalEnvironment, pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {isSuperExpression} from "../util/node/is-super-expression";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a Block
 */
export function evaluateBlock ({node, environment, typescript, evaluate}: IEvaluatorOptions<TS.Block>): void {
	// Prepare a lexical environment for the Block context
	const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment);

	for (let i = 0; i < node.statements.length; i++) {
		const statement = node.statements[i];

		// Don't execute 'super()' within Constructor Blocks since this is handled in another level
		if (typescript.isConstructorDeclaration(node.parent) && i === 0 && typescript.isExpressionStatement(statement) && typescript.isCallExpression(statement.expression) && isSuperExpression(statement.expression.expression, typescript)) continue;

		evaluate.statement(statement, localLexicalEnvironment);

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}