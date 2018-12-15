import {IEvaluatorOptions} from "./i-evaluator-options";
import {ShorthandPropertyAssignment} from "typescript";
import {IndexLiteral} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UndefinedIdentifierError} from "../error/undefined-identifier-error/undefined-identifier-error";

/**
 * Evaluates, or attempts to evaluate, a ShorthandPropertyAssignment, before applying it on the given parent
 * @param {IEvaluatorOptions<ShorthandPropertyAssignment>} options
 * @param {IndexLiteral} parent
 * @returns {Promise<void>}
 */
export function evaluateShorthandPropertyAssignment ({environment, node}: IEvaluatorOptions<ShorthandPropertyAssignment>, parent: IndexLiteral): void {
	const identifier = node.name.text;
	const match = getFromLexicalEnvironment(environment, identifier);

	if (match == null) {
		throw new UndefinedIdentifierError({identifier: node.name});
	}

	parent[identifier] = match.literal;
}