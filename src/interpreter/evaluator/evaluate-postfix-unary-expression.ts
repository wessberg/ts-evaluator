import {IEvaluatorOptions} from "./i-evaluator-options";
import {isIdentifier, PostfixUnaryExpression, SyntaxKind} from "typescript";
import {Literal} from "../literal/literal";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";

/**
 * Evaluates, or attempts to evaluate, a PostfixUnaryExpression
 * @param {IEvaluatorOptions<PostfixUnaryExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluatePostfixUnaryExpression ({node, environment}: IEvaluatorOptions<PostfixUnaryExpression>): Literal {

	switch (node.operator) {
		case SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!isIdentifier(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand});
			}

			// Find the value associated with the identifier within the environment.
			return (getRelevantDictFromLexicalEnvironment(environment, node.operand.text)![node.operand.text]! as number)++;
		}

		case SyntaxKind.MinusMinusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!isIdentifier(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand});
			}

			// Find the value associated with the identifier within the environment.
			return (getRelevantDictFromLexicalEnvironment(environment, node.operand.text)![node.operand.text]! as number)--;
		}
	}
}