import {EvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error.js";
import {TS} from "../../../type/ts.js";

/**
 * Gets the name of the given declaration
 */
export function getDeclarationName({node, evaluate, environment, typescript, statementTraversalStack}: EvaluatorOptions<TS.Declaration>): string | number | undefined {
	const name = typescript.getNameOfDeclaration(node);
	if (name == null) return undefined;

	if (typescript.isIdentifier(name)) {
		return name.text;
	} else if (typescript.isPrivateIdentifier?.(name)) {
		return name.text;
	} else if (typescript.isStringLiteralLike(name)) {
		return name.text;
	} else if (typescript.isNumericLiteral(name)) {
		return Number(name.text);
	} else if (typescript.isComputedPropertyName(name)) {
		return evaluate.expression(name.expression, environment, statementTraversalStack) as ReturnType<typeof getDeclarationName>;
	} else {
		throw new UnexpectedNodeError({node: name, typescript});
	}
}
