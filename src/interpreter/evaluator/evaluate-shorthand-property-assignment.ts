import {IEvaluatorOptions} from "./i-evaluator-options";
import {IndexLiteral} from "../literal/literal";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment";
import {UndefinedIdentifierError} from "../error/undefined-identifier-error/undefined-identifier-error";
import {TS} from "../../type/ts";

/**
 * Evaluates, or attempts to evaluate, a ShorthandPropertyAssignment, before applying it on the given parent
 */
export function evaluateShorthandPropertyAssignment ({environment, node}: IEvaluatorOptions<TS.ShorthandPropertyAssignment>, parent: IndexLiteral): void {
	const identifier = node.name.text;
	const match = getFromLexicalEnvironment(node, environment, identifier);

	if (match == null) {
		throw new UndefinedIdentifierError({node: node.name});
	}

	parent[identifier] = match.literal;
}