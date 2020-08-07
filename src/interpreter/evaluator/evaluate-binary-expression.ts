import {IEvaluatorOptions} from "./i-evaluator-options";
import {getDotPathFromNode} from "../lexical-environment/get-dot-path-from-node";
import {setInLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {Literal} from "../literal/literal";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {UndefinedLeftValueError} from "../error/undefined-left-value-error/undefined-left-value-error";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a BinaryExpression
 */
export function evaluateBinaryExpression(options: IEvaluatorOptions<TS.BinaryExpression>): Literal {
	const {node, environment, evaluate, logger, statementTraversalStack, reporting, typescript} = options;

	const leftValue = evaluate.expression(node.left, environment, statementTraversalStack) as number;
	const rightValue = evaluate.expression(node.right, environment, statementTraversalStack) as number;
	const leftIdentifier = getDotPathFromNode({...options, node: node.left});

	const operator = node.operatorToken.kind;
	switch (operator) {
		case typescript.SyntaxKind.AmpersandToken: {
			return leftValue & rightValue;
		}

		case typescript.SyntaxKind.AmpersandAmpersandToken: {
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			return leftValue && rightValue;
		}

		case typescript.SyntaxKind.AmpersandEqualsToken:
		case typescript.SyntaxKind.CaretEqualsToken:
		case typescript.SyntaxKind.BarEqualsToken:
		case typescript.SyntaxKind.MinusEqualsToken:
		case typescript.SyntaxKind.PlusEqualsToken:
		case typescript.SyntaxKind.PercentEqualsToken:
		case typescript.SyntaxKind.SlashEqualsToken:
		case typescript.SyntaxKind.AsteriskEqualsToken:
		case typescript.SyntaxKind.AsteriskAsteriskEqualsToken:
		case typescript.SyntaxKind.LessThanLessThanEqualsToken:
		case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken:
		case typescript.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
		case typescript.SyntaxKind.QuestionQuestionEqualsToken:
		case typescript.SyntaxKind.BarBarEqualsToken:
		case typescript.SyntaxKind.AmpersandAmpersandEqualsToken:{
			// There's nothing in the engine restricting you from applying this kind of arithmetic operation on non-numeric data types
			let computedValue = leftValue;
			switch (operator) {
				case typescript.SyntaxKind.AmpersandEqualsToken:
					computedValue &= rightValue;
					break;
				case typescript.SyntaxKind.CaretEqualsToken:
					computedValue ^= rightValue;
					break;
				case typescript.SyntaxKind.BarEqualsToken:
					computedValue |= rightValue;
					break;
				case typescript.SyntaxKind.AsteriskEqualsToken:
					computedValue *= rightValue;
					break;
				case typescript.SyntaxKind.AsteriskAsteriskEqualsToken:
					computedValue **= rightValue;
					break;
				case typescript.SyntaxKind.LessThanLessThanEqualsToken:
					computedValue <<= rightValue;
					break;
				case typescript.SyntaxKind.GreaterThanGreaterThanEqualsToken:
					computedValue >>= rightValue;
					break;
				case typescript.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
					computedValue >>>= rightValue;
					break;
				case typescript.SyntaxKind.MinusEqualsToken:
					computedValue -= rightValue;
					break;
				case typescript.SyntaxKind.PlusEqualsToken:
					computedValue += rightValue;
					break;
				case typescript.SyntaxKind.PercentEqualsToken:
					computedValue %= rightValue;
					break;
				case typescript.SyntaxKind.SlashEqualsToken:
					computedValue /= rightValue;
					break;
				case typescript.SyntaxKind.QuestionQuestionEqualsToken:
					computedValue = leftValue == null ? rightValue : leftValue;
					break;
				case typescript.SyntaxKind.BarBarEqualsToken:
					if (!leftValue) {
						computedValue = rightValue;
					}
					break;
				case typescript.SyntaxKind.AmpersandAmpersandEqualsToken:
					if (leftValue) {
						computedValue = rightValue;
					}
					break;
			}

			// Update to the left-value within the environment if it exists there and has been updated
			if (leftIdentifier != null) {
				setInLexicalEnvironment({env: environment, path: leftIdentifier, value: computedValue, reporting, node});
			}

			// Return the computed value
			return computedValue;
		}

		case typescript.SyntaxKind.AsteriskToken: {
			return leftValue * rightValue;
		}

		case typescript.SyntaxKind.AsteriskAsteriskToken: {
			return leftValue ** rightValue;
		}

		case typescript.SyntaxKind.BarToken: {
			return leftValue | rightValue;
		}

		case typescript.SyntaxKind.BarBarToken: {
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			return leftValue || rightValue;
		}

		case typescript.SyntaxKind.CaretToken: {
			return leftValue ^ rightValue;
		}

		case typescript.SyntaxKind.CommaToken: {
			return rightValue;
		}

		case typescript.SyntaxKind.MinusToken:
			return leftValue - rightValue;

		case typescript.SyntaxKind.PlusToken:
			logger.logResult(leftValue + rightValue, "BinaryExpression (PlusToken)");
			return leftValue + rightValue;

		case typescript.SyntaxKind.PercentToken:
			return leftValue % rightValue;

		case typescript.SyntaxKind.SlashToken:
			return leftValue / rightValue;

		case typescript.SyntaxKind.EqualsToken: {
			// Update to the left-value within the environment if it exists there and has been updated
			if (leftIdentifier != null) {
				setInLexicalEnvironment({env: environment, path: leftIdentifier, value: rightValue, reporting, node});
				logger.logBinding(leftIdentifier, rightValue, "Assignment");
			} else {
				throw new UndefinedLeftValueError({node: node.left});
			}

			// The return value of an assignment is always the assigned value
			return rightValue;
		}

		case typescript.SyntaxKind.EqualsEqualsToken: {
			// eslint-disable-next-line eqeqeq
			return leftValue == rightValue;
		}

		case typescript.SyntaxKind.EqualsEqualsEqualsToken: {
			return leftValue === rightValue;
		}

		case typescript.SyntaxKind.ExclamationEqualsToken: {
			// eslint-disable-next-line eqeqeq
			return leftValue != rightValue;
		}

		case typescript.SyntaxKind.ExclamationEqualsEqualsToken: {
			return leftValue !== rightValue;
		}

		case typescript.SyntaxKind.GreaterThanToken:
			return leftValue > rightValue;

		case typescript.SyntaxKind.GreaterThanEqualsToken:
			return leftValue >= rightValue;

		case typescript.SyntaxKind.LessThanToken:
			return leftValue < rightValue;

		case typescript.SyntaxKind.LessThanEqualsToken:
			return leftValue <= rightValue;

		case typescript.SyntaxKind.InKeyword: {
			return leftValue in ((rightValue as unknown) as Record<string, unknown>);
		}

		// Nullish coalescing (A ?? B)
		case typescript.SyntaxKind.QuestionQuestionToken:
			return leftValue != null ? leftValue : rightValue;

		case typescript.SyntaxKind.InstanceOfKeyword: {
			return ((leftValue as unknown) as Record<string, unknown>) instanceof ((rightValue as unknown) as CallableFunction);
		}
	}

	// Throw if the operator couldn't be handled
	throw new UnexpectedNodeError({node: node.operatorToken, typescript});
}
