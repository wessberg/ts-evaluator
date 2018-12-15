import {IEvaluatorOptions} from "./i-evaluator-options";
import {isIdentifier, PrefixUnaryExpression, SyntaxKind} from "typescript";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {Literal} from "../literal/literal";

// tslint:disable:strict-boolean-expressions

/**
 * Evaluates, or attempts to evaluate, a PrefixUnaryExpression
 * @param {IEvaluatorOptions<PrefixUnaryExpression>} options
 * @returns {Promise<Literal>}
 */
export function evaluatePrefixUnaryExpression ({node, environment, evaluate, statementTraversalStack}: IEvaluatorOptions<PrefixUnaryExpression>): Literal {
	const operandValue = (evaluate.expression(node.operand, environment, statementTraversalStack)) as number;

	switch (node.operator) {
		case SyntaxKind.PlusToken: {
			return +operandValue;
		}

		case SyntaxKind.MinusToken: {
			return -operandValue;
		}

		case SyntaxKind.TildeToken: {
			return ~operandValue;
		}

		case SyntaxKind.ExclamationToken: {
			return !operandValue;
		}

		case SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!isIdentifier(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand});
			}

			// Find the value associated with the identifier within the environment.
			const dict = getRelevantDictFromLexicalEnvironment(environment, node.operand.text)!;
			return ++(dict[node.operand.text]! as number);
		}

		case SyntaxKind.MinusMinusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!isIdentifier(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand});
			}

			// Find the value associated with the identifier within the environment.
			const dict = getRelevantDictFromLexicalEnvironment(environment, node.operand.text)!;
			return --(dict[node.operand.text]! as number);
		}
	}
}