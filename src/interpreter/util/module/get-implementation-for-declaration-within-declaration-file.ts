import {Declaration, isModuleDeclaration, ModuleDeclaration, SyntaxKind} from "typescript";
import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind";
import {Literal} from "../../literal/literal";
import {ModuleNotFoundError} from "../../error/module-not-found-error/module-not-found-error";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error";
import {IEvaluatorOptions} from "../../evaluator/i-evaluator-options";
import {getDeclarationName} from "../declaration/get-declaration-name";
import {EvaluationError} from "../../error/evaluation-error/evaluation-error";

/**
 * Gets an implementation for the given declaration that lives within a declaration file
 * @param {IEvaluatorOptions<Declaration>} options
 * @return {Literal}
 */
export function getImplementationForDeclarationWithinDeclarationFile (options: IEvaluatorOptions<Declaration>): Literal {
	const {node} = options;
	const name = getDeclarationName(options);

	if (name == null) {
		throw new UnexpectedNodeError({node});
	}

	// Require itself may be requested. If so, return it
	if (name === "require") return options.require;

	const moduleDeclaration = isModuleDeclaration(node) ? node : findNearestParentNodeOfKind<ModuleDeclaration>(node, SyntaxKind.ModuleDeclaration);
	if (moduleDeclaration == null) {
		throw new UnexpectedNodeError({node});
	}

	try {
		const module = options.require(moduleDeclaration.name.text);
		return isModuleDeclaration(node)
			? module
			: module[name];
	} catch (ex) {
		console.log(ex);
		if (ex instanceof EvaluationError) throw ex;
		else throw new ModuleNotFoundError({path: moduleDeclaration.name.text});
	}
}