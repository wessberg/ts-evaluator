import {IEvaluatorOptions} from "./i-evaluator-options";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {Literal} from "../literal/literal";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a PrefixUnaryExpression
 */
export function evaluatePrefixUnaryExpression ({node, environment, evaluate, reporting, typescript, statementTraversalStack}: IEvaluatorOptions<TS.PrefixUnaryExpression>): Literal {
	const operandValue = (evaluate.expression(node.operand, environment, statementTraversalStack)) as number;

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
			// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
			return !operandValue;
		}

		case typescript.SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!typescript.isIdentifier(node.operand) && !typescript.isPrivateIdentifier?.(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand, typescript});
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
				throw new UnexpectedNodeError({node: node.operand, typescript});
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