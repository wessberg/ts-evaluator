import type {EvaluatorOptions} from "./evaluator-options.js";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error.js";
import type {Literal} from "../literal/literal.js";
import type {TS} from "../../type/ts.js";

/**
 * Evaluates, or attempts to evaluate, a PrefixUnaryExpression
 */
export function evaluatePrefixUnaryExpression(options: EvaluatorOptions<TS.PrefixUnaryExpression>): Literal {
	const {node, environment, evaluate, reporting, typescript, throwError, getCurrentError} = options;
	const operandValue = evaluate.expression(node.operand, options) as number;

	if (getCurrentError() != null) {
		return;
	}

	switch (node.operator) {
		case typescript.SyntaxKind.PlusToken: {
			return +operandValue;
		}

		case typescript.SyntaxKind.MinusToken: {
			return -operandValue;
		}

		case typescript.SyntaxKind.TildeToken: {
			return ~operandValue;
		}

		case typescript.SyntaxKind.ExclamationToken: {
			return !operandValue;
		}

		case typescript.SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!typescript.isIdentifier(node.operand) && !typescript.isPrivateIdentifier?.(node.operand)) {
				return throwError(new UnexpectedNodeError({node: node.operand, environment, typescript}));
			}

			// Find the value associated with the identifier within the environment.
			const dict = getRelevantDictFromLexicalEnvironment(environment, node.operand.text)!;
			const value = ++(dict[node.operand.text]! as number);

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
			const dict = getRelevantDictFromLexicalEnvironment(environment, node.operand.text)!;
			const value = --(dict[node.operand.text]! as number);

			// Inform reporting hooks if any is given
			if (reporting.reportBindings != null) {
				reporting.reportBindings({path: node.operand.text, value, node});
			}
			return value;
		}
	}
}
