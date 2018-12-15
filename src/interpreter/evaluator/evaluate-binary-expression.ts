import {IEvaluatorOptions} from "./i-evaluator-options";
import {BinaryExpression, SyntaxKind} from "typescript";
import {getDotPathFromNode} from "../lexical-environment/get-dot-path-from-node";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {Literal} from "../literal/literal";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {UndefinedLeftValueError} from "../error/undefined-left-value-error/undefined-left-value-error";

// tslint:disable:strict-boolean-expressions

/**
 * Evaluates, or attempts to evaluate, a BinaryExpression
 * @param {IEvaluatorOptions<BinaryExpression>} options
 * @returns {Literal}
 */
export function evaluateBinaryExpression ({node, environment, evaluate, logger, statementTraversalStack, ...rest}: IEvaluatorOptions<BinaryExpression>): Literal {
	const leftValue = (evaluate.expression(node.left, environment, statementTraversalStack)) as number;
	const rightValue = (evaluate.expression(node.right, environment, statementTraversalStack)) as number;
	const leftIdentifier = getDotPathFromNode({node: node.left, environment, evaluate, logger, statementTraversalStack, ...rest});

	const operator = node.operatorToken.kind;
	switch (operator) {

		case SyntaxKind.AmpersandToken: {
			return leftValue & rightValue;
		}

		case SyntaxKind.AmpersandAmpersandToken: {
			return leftValue && rightValue;
		}

		case SyntaxKind.AmpersandEqualsToken:
		case SyntaxKind.CaretEqualsToken:
		case SyntaxKind.BarEqualsToken:
		case SyntaxKind.MinusEqualsToken:
		case SyntaxKind.PlusEqualsToken:
		case SyntaxKind.PercentEqualsToken:
		case SyntaxKind.SlashEqualsToken:
		case SyntaxKind.AsteriskEqualsToken:
		case SyntaxKind.AsteriskAsteriskEqualsToken:
		case SyntaxKind.LessThanLessThanEqualsToken:
		case SyntaxKind.GreaterThanGreaterThanEqualsToken:
		case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken: {

			// There's nothing in the engine restricting you from applying this kind of arithmetic operation on non-numeric data types
			let computedValue = leftValue;
			switch (operator) {
				case SyntaxKind.AmpersandEqualsToken:
					computedValue &= rightValue;
					break;
				case SyntaxKind.CaretEqualsToken:
					computedValue ^= rightValue;
					break;
				case SyntaxKind.BarEqualsToken:
					computedValue |= rightValue;
					break;
				case SyntaxKind.AsteriskEqualsToken:
					computedValue *= rightValue;
					break;
				case SyntaxKind.AsteriskAsteriskEqualsToken:
					computedValue **= rightValue;
					break;
				case SyntaxKind.LessThanLessThanEqualsToken:
					computedValue <<= rightValue;
					break;
				case SyntaxKind.GreaterThanGreaterThanEqualsToken:
					computedValue >>= rightValue;
					break;
				case SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
					computedValue >>>= rightValue;
					break;
				case SyntaxKind.MinusEqualsToken:
					computedValue -= rightValue;
					break;
				case SyntaxKind.PlusEqualsToken:
					computedValue += rightValue;
					break;
				case SyntaxKind.PercentEqualsToken:
					computedValue %= rightValue;
					break;
				case SyntaxKind.SlashEqualsToken:
					computedValue /= rightValue;
					break;
			}

			// Update to the left-value within the environment if it exists there and has been updated
			if (leftIdentifier != null) {
				setInLexicalEnvironment(environment, leftIdentifier, computedValue);
			}

			// Return the computed value
			return computedValue;
		}

		case SyntaxKind.AsteriskToken: {
			return leftValue * rightValue;
		}

		case SyntaxKind.AsteriskAsteriskToken: {
			return leftValue ** rightValue;
		}

		case SyntaxKind.BarToken: {
			return leftValue | rightValue;
		}

		case SyntaxKind.BarBarToken: {
			return leftValue || rightValue;
		}

		case SyntaxKind.CaretToken: {
			return leftValue ^ rightValue;
		}

		case SyntaxKind.CommaToken: {
			return rightValue;
		}

		case SyntaxKind.MinusToken:
			return leftValue - rightValue;

		case SyntaxKind.PlusToken:
			logger.logResult(leftValue + rightValue, "BinaryExpression (PlusToken)");
			return leftValue + rightValue;

		case SyntaxKind.PercentToken:
			return leftValue % rightValue;

		case SyntaxKind.SlashToken:
			return leftValue / rightValue;

		case SyntaxKind.EqualsToken: {
			// Update to the left-value within the environment if it exists there and has been updated
			if (leftIdentifier != null) {
				setInLexicalEnvironment(environment, leftIdentifier, rightValue);
				logger.logBinding(leftIdentifier, rightValue, "Assignment");
			}

			else {
				throw new UndefinedLeftValueError();
			}

			// The return value of an assignment is always the assigned value
			return rightValue;
		}

		case SyntaxKind.EqualsEqualsToken: {
			// tslint:disable:triple-equals
			return leftValue == rightValue;
			// tslint:enable:triple-equals
		}

		case SyntaxKind.EqualsEqualsEqualsToken: {
			return leftValue === rightValue;
		}

		case SyntaxKind.ExclamationEqualsToken: {
			// tslint:disable:triple-equals
			return leftValue != rightValue;
			// tslint:enable:triple-equals
		}

		case SyntaxKind.ExclamationEqualsEqualsToken: {
			return leftValue !== rightValue;
		}

		case SyntaxKind.GreaterThanToken:
			return leftValue > rightValue;

		case SyntaxKind.GreaterThanEqualsToken:
			return leftValue >= rightValue;

		case SyntaxKind.LessThanToken:
			return leftValue < rightValue;

		case SyntaxKind.LessThanEqualsToken:
			return leftValue <= rightValue;

		case SyntaxKind.InKeyword: {
			return leftValue in (rightValue as unknown as object);
		}

		case SyntaxKind.InstanceOfKeyword: {
			return leftValue as unknown as object instanceof (rightValue as unknown as Function);
		}
	}

	// Throw if the operator couldn't be handled
	throw new UnexpectedNodeError({node: node.operatorToken});
}