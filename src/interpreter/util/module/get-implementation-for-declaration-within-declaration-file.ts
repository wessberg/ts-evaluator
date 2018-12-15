import {Declaration, isModuleDeclaration, ModuleDeclaration, SyntaxKind} from "typescript";
import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind";
import {Literal} from "../../literal/literal";
import {ModuleNotFoundError} from "../../error/module-not-found-error/module-not-found-error";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error";
import {IEvaluatorOptions} from "../../evaluator/i-evaluator-options";
import {getDeclarationName} from "../declaration/get-declaration-name";
import {EvaluationError} from "../../error/evaluation-error/evaluation-error";
import {getFromLexicalEnvironment} from "../../lexical-environment/lexical-environment";

/**
 * Gets an implementation for the given declaration that lives within a declaration file
 * @param {IEvaluatorOptions<Declaration>} options
 * @return {Promise<Literal>}
 */
export async function getImplementationForDeclarationWithinDeclarationFile (options: IEvaluatorOptions<Declaration>): Promise<Literal> {
	const {node} = options;
	const name = await getDeclarationName(options);

	if (name == null) {
		throw new UnexpectedNodeError({node});
	}

	// First see if it lives within the lexical environment
	const matchInLexicalEnvironment = getFromLexicalEnvironment(options.environment, name as string);
	// If so, return it
	if (matchInLexicalEnvironment != null && matchInLexicalEnvironment.literal != null) {
		return matchInLexicalEnvironment.literal;
	}

	// Otherwise, expect it to be something that is require'd on demand
	const require = getFromLexicalEnvironment(options.environment, "require")!.literal as NodeRequire;

	const moduleDeclaration = isModuleDeclaration(node) ? node : findNearestParentNodeOfKind<ModuleDeclaration>(node, SyntaxKind.ModuleDeclaration);
	if (moduleDeclaration == null) {
		throw new UnexpectedNodeError({node});
	}

	try {
		const module = require(moduleDeclaration.name.text);
		return isModuleDeclaration(node)
			? module
			: module[name];
	} catch (ex) {
		if (ex instanceof EvaluationError) throw ex;
		else throw new ModuleNotFoundError({path: moduleDeclaration.name.text});
	}
}