import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind.js";
import {Literal} from "../../literal/literal.js";
import {ModuleNotFoundError} from "../../error/module-not-found-error/module-not-found-error.js";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error.js";
import {EvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {getDeclarationName} from "../declaration/get-declaration-name.js";
import {EvaluationError} from "../../error/evaluation-error/evaluation-error.js";
import {getFromLexicalEnvironment} from "../../lexical-environment/lexical-environment.js";
import {TS} from "../../../type/ts.js";

/**
 * Gets an implementation for the given declaration that lives within a declaration file
 */
export function getImplementationForDeclarationWithinDeclarationFile(options: EvaluatorOptions<TS.Declaration>): Literal {
	const {node, typescript} = options;
	const name = getDeclarationName(options);

	if (name == null) {
		throw new UnexpectedNodeError({node, typescript});
	}

	// First see if it lives within the lexical environment
	const matchInLexicalEnvironment = getFromLexicalEnvironment(node, options.environment, name as string);
	// If so, return it
	if (matchInLexicalEnvironment != null && matchInLexicalEnvironment.literal != null) {
		return matchInLexicalEnvironment.literal;
	}

	// Otherwise, expect it to be something that is require'd on demand
	const require = getFromLexicalEnvironment(node, options.environment, "require")!.literal as NodeRequire;

	const moduleDeclaration = typescript.isModuleDeclaration(node)
		? node
		: findNearestParentNodeOfKind<TS.ModuleDeclaration>(node, typescript.SyntaxKind.ModuleDeclaration, typescript);
	if (moduleDeclaration == null) {
		throw new UnexpectedNodeError({node, typescript});
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
		const module = options.moduleOverrides?.[moduleDeclaration.name.text] ?? require(moduleDeclaration.name.text);
		return typescript.isModuleDeclaration(node) ? module : module[name] ?? module;
	} catch (ex) {
		if (ex instanceof EvaluationError) throw ex;
		else throw new ModuleNotFoundError({node: moduleDeclaration, path: moduleDeclaration.name.text});
	}
}

export function getImplementationFromExternalFile(name: string, moduleSpecifier: string, options: EvaluatorOptions<TS.Node>): Literal {
	const {node} = options;

	const require = getFromLexicalEnvironment(node, options.environment, "require")!.literal as NodeRequire;

	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
		const module = options.moduleOverrides?.[moduleSpecifier] ?? require(moduleSpecifier);
		return module[name] ?? module.default ?? module;
	} catch (ex) {
		if (ex instanceof EvaluationError) throw ex;
		else throw new ModuleNotFoundError({node, path: moduleSpecifier});
	}
}
