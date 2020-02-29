import {IEvaluatorOptions} from "./i-evaluator-options";
import {Literal} from "../literal/literal";
import {getRelevantDictFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UnexpectedNodeError} from "../error/unexpected-node-error/unexpected-node-error";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a PostfixUnaryExpression
 */
export function evaluatePostfixUnaryExpression({
	node,
	evaluate,
	environment,
	reporting,
	typescript,
	statementTraversalStack
}: IEvaluatorOptions<TS.PostfixUnaryExpression>): Literal {
	// Make sure to evaluate the operand to ensure that it is found in the lexical environment
	evaluate.expression(node.operand, environment, statementTraversalStack);

	switch (node.operator) {
		case typescript.SyntaxKind.PlusPlusToken: {
			// If the Operand isn't an identifier, this will be a SyntaxError
			if (!typescript.isIdentifier(node.operand) && !typescript.isPrivateIdentifier?.(node.operand)) {
				throw new UnexpectedNodeError({node: node.operand, typescript});
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
				throw new UnexpectedNodeError({node: node.operand, typescript});
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
