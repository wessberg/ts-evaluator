import type {EvaluatorOptions} from "./evaluator-options.js";
import type {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import { pathInLexicalEnvironmentEquals} from "../lexical-environment/lexical-environment.js";
import {cloneLexicalEnvironment} from "../lexical-environment/clone-lexical-environment.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {isSuperExpression} from "../util/node/is-super-expression.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a Block
 */
export function evaluateBlock(options: EvaluatorOptions<TS.Block>): void {
	const {node, environment, typescript, evaluate, getCurrentError} = options;
	// Prepare a lexical environment for the Block context
	const localLexicalEnvironment: LexicalEnvironment = cloneLexicalEnvironment(environment, node);

	for (let i = 0; i < node.statements.length; i++) {
		const statement = node.statements[i];

		// Don't execute 'super()' within Constructor Blocks since this is handled in another level
		if (
			typescript.isConstructorDeclaration(node.parent) &&
			i === 0 &&
			typescript.isExpressionStatement(statement) &&
			typescript.isCallExpression(statement.expression) &&
			isSuperExpression(statement.expression.expression, typescript)
		) {
			continue;
		}

		evaluate.statement(statement, {...options, environment: localLexicalEnvironment});
		if (getCurrentError() != null) break;

		// Check if a 'break', 'continue', or 'return' statement has been encountered, break the block
		if (pathInLexicalEnvironmentEquals(node, localLexicalEnvironment, true, BREAK_SYMBOL, CONTINUE_SYMBOL, RETURN_SYMBOL)) {
			break;
		}
	}
}
