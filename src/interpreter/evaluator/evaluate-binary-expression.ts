import type {EvaluatorOptions} from "./evaluator-options.js";
import {getDotPathFromNode} from "../lexical-environment/get-dot-path-from-node.js";
import {findLexicalEnvironmentInSameContext, setInLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import type {Literal} from "../literal/literal.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import {UndefinedLeftValueError} from "../error/undefined-left-value-error/undefined-left-value-error.js";
import type {TS} from "../../type/ts.js";
import {getInnerNode} from "../util/node/get-inner-node.js";
import {findNearestParentNodeWithName} from "../util/node/find-nearest-parent-node-of-kind.js";
import {isTypescriptNode} from "../util/node/is-node.js";

/**
 * Evaluates, or attempts to evaluate, a BinaryExpression
 */
export function evaluateBinaryExpression(options: EvaluatorOptions<TS.BinaryExpression>): Literal {
	const {node, environment, evaluate, logger, throwError, typeChecker, typescript, getCurrentError} = options;

	const leftValue = evaluate.expression(node.left, options) as number;

	if (getCurrentError() != null) {
		return;
	}

	const rightValue = evaluate.expression(node.right, options) as number;

	if (getCurrentError() != null) {
		return;
	}

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
		case typescript.SyntaxKind.AmpersandAmpersandEqualsToken: {
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
				setInLexicalEnvironment({...options, path: leftIdentifier, value: computedValue});
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
				const innerLeftIdentifier = getInnerNode(node.left, typescript);
				const leftIdentifierSymbol = typeChecker?.getSymbolAtLocation(innerLeftIdentifier);
				let leftIdentifierValueDeclaration = leftIdentifierSymbol?.valueDeclaration;

				// If we don't have a typechecker to work it, try parsing the SourceFile in order to locate the declaration
				if (leftIdentifierValueDeclaration == null && typeChecker == null && typescript.isIdentifier(innerLeftIdentifier)) {
					const result = findNearestParentNodeWithName<TS.Declaration>(innerLeftIdentifier.parent, innerLeftIdentifier.text, options as EvaluatorOptions<TS.Declaration>);

					if (isTypescriptNode(result)) {
						leftIdentifierValueDeclaration = result as TS.Declaration;
					}
				}

				const bestLexicalEnvironment =
					leftIdentifierValueDeclaration == null ? environment : findLexicalEnvironmentInSameContext(environment, leftIdentifierValueDeclaration, typescript) ?? environment;

				setInLexicalEnvironment({...options, environment: bestLexicalEnvironment, path: leftIdentifier, value: rightValue});
				logger.logBinding(leftIdentifier, rightValue, "Assignment");
			} else {
				return throwError(new UndefinedLeftValueError({node: node.left, environment}));
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
			return leftValue in (rightValue as unknown as Record<string, unknown>);
		}

		// Nullish coalescing (A ?? B)
		case typescript.SyntaxKind.QuestionQuestionToken:
			return leftValue != null ? leftValue : rightValue;

		case typescript.SyntaxKind.InstanceOfKeyword: {
			return (leftValue as unknown as Record<string, unknown>) instanceof (rightValue as unknown as CallableFunction);
		}
	}

	// Throw if the operator couldn't be handled
	return throwError(new UnexpectedNodeError({node: node.operatorToken, typescript, environment}));
}
