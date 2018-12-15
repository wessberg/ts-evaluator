import {Declaration, getNameOfDeclaration, isComputedPropertyName, isIdentifier, isNumericLiteral, isStringLiteralLike} from "typescript";
import {IEvaluatorOptions} from "../../evaluator/i-evaluator-options";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error";

/**
 * Gets the name of the given declaration
 * @param {IEvaluatorOptions<Declaration>} options
 * @return {Promise<string|number?>}
 */
export async function getDeclarationName ({node, evaluate, environment, statementTraversalStack}: IEvaluatorOptions<Declaration>): Promise<string|number|undefined> {
	const name = getNameOfDeclaration(node);
	if (name == null) return undefined;

	if (isIdentifier(name)) {
		return name.text;
	}

	else if (isStringLiteralLike(name)) {
		return name.text;
	}

	else if (isNumericLiteral(name)) {
		return Number(name.text);
	}

	else if (isComputedPropertyName(name)) {
		return (await evaluate.expression(name.expression, environment, statementTraversalStack)) as ReturnType<typeof getDeclarationName>;
	}

	else {
		throw new UnexpectedNodeError({node: name});
	}

}