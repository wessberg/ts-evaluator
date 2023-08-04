import type {EvaluatorOptions} from "./evaluator-options.js";
import type {Literal} from "../literal/literal.js";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a PostfixUnaryExpression
 */
export function evaluatePostfixUnaryExpression(options: EvaluatorOptions<TS.PostfixUnaryExpression>): Literal {
	const {evaluate, node, environment, typescript, throwError, reporting} = options;

	// Make sure to evaluate the operand to ensure that it is found in the lexical environment
	evaluate.expression(node.operand, options);

	switch (node.operator) {
		case typescript.SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!typescript.isIdentifier(node.operand) && !typescript.isPrivateIdentifier?.(node.operand)) {
				return throwError(new UnexpectedNodeError({node: node.operand, environment, typescript}));
			}

			// Find the value associated with the identifier within the environment.
			const value = (getRelevantDictFromLexicalEnvironment(environment, node.operand.text)![node.operand.text]! as number)++;

			// Inform reporting hooks if any is given
			if (reporting.reportBindings != null) {
				reporting.reportBindings({path: node.operand.text, value, node});
			}
			return value;
		}

		case typescript.SyntaxKind.MinusMinusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!typescript.isIdentifier(node.operand) && !typescript.isPrivateIdentifier?.(node.operand)) {
				return throwError(new UnexpectedNodeError({node: node.operand, environment, typescript}));
			}

			// Find the value associated with the identifier within the environment.
			const value = (getRelevantDictFromLexicalEnvironment(environment, node.operand.text)![node.operand.text]! as number)--;

			// Inform reporting hooks if any is given
			if (reporting.reportBindings != null) {
				reporting.reportBindings({path: node.operand.text, value, node});
			}
			return value;
		}
	}
}
