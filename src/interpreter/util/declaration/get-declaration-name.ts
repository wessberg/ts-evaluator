import {EvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error.js";
import {TS} from "../../../type/ts.js";
import { EvaluationError } from "../../error/evaluation-error/evaluation-error.js";

/**
 * Gets the name of the given declaration
 */
export function getDeclarationName(options: EvaluatorOptions<TS.Declaration>): string | number | EvaluationError | undefined {
	const {node, evaluate, environment, typescript, throwError} = options;
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
		return evaluate.expression(name.expression, options) as ReturnType<typeof getDeclarationName>;
	} else {
		return throwError(new UnexpectedNodeError({node: name, environment, typescript}));
	}
}
