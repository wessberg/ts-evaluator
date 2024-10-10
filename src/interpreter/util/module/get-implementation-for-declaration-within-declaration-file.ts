import {findNearestParentNodeOfKind} from "../node/find-nearest-parent-node-of-kind.js";
import type {Literal} from "../../literal/literal.js";
import {ModuleNotFoundError} from "../../error/module-not-found-error/module-not-found-error.js";
import {UnexpectedNodeError} from "../../error/unexpected-node-error/unexpected-node-error.js";
import type {EvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {getDeclarationName} from "../declaration/get-declaration-name.js";
import {isEvaluationError} from "../../error/evaluation-error/evaluation-error.js";
import {getFromLexicalEnvironment} from "../../lexical-environment/lexical-environment.js";
import type {TS} from "../../../type/ts.js";
import {getResolvedModuleName} from "./get-resolved-module-name.js";

/**
 * Gets an implementation for the given declaration that lives within a declaration file
 */
export function getImplementationForDeclarationWithinDeclarationFile(options: EvaluatorOptions<TS.Declaration>): Literal {
	const {node, typescript, throwError, environment} = options;
	const name = getDeclarationName(options);

	if (isEvaluationError(name)) {
		return name;
	}

	if (name == null) {
		return throwError(new UnexpectedNodeError({node, environment, typescript}));
	}

	// First see if it lives within the lexical environment
	const matchInLexicalEnvironment = getFromLexicalEnvironment(node, options.environment, name as string);
	// If so, return it
	if (matchInLexicalEnvironment?.literal != null) {
		return matchInLexicalEnvironment.literal;
	}

	// Otherwise, expect it to be something that is require'd on demand
	const require = getFromLexicalEnvironment(node, options.environment, "require")!.literal as NodeRequire;

	const moduleDeclaration = typescript.isModuleDeclaration(node)
		? node
		: findNearestParentNodeOfKind<TS.ModuleDeclaration>(node, typescript.SyntaxKind.ModuleDeclaration, typescript);
	if (moduleDeclaration == null) {
		return throwError(new UnexpectedNodeError({node, environment, typescript}));
	}
	const moduleSpecifier = moduleDeclaration.name.text;
	const resolvedModuleSpecifier = getResolvedModuleName(moduleSpecifier, options);
	try {
		const module = options.moduleOverrides?.[moduleSpecifier] ?? options.moduleOverrides?.[resolvedModuleSpecifier] ?? require(resolvedModuleSpecifier);
		return typescript.isModuleDeclaration(node) ? module : (module[name] ?? module);
	} catch (ex) {
		if (isEvaluationError(ex)) return ex;
		else return throwError(new ModuleNotFoundError({node: moduleDeclaration, environment, path: resolvedModuleSpecifier}));
	}
}

export function getImplementationFromExternalFile(name: string, moduleSpecifier: string, options: EvaluatorOptions<TS.Node>): Literal {
	const {node, throwError, environment} = options;

	const require = getFromLexicalEnvironment(node, options.environment, "require")!.literal as NodeRequire;
	const resolvedModuleSpecifier = getResolvedModuleName(moduleSpecifier, options);

	try {
		const module = options.moduleOverrides?.[moduleSpecifier] ?? options.moduleOverrides?.[resolvedModuleSpecifier] ?? require(resolvedModuleSpecifier);
		return module[name] ?? module.default ?? module;
	} catch (ex) {
		if (isEvaluationError(ex)) return ex;
		else return throwError(new ModuleNotFoundError({node, environment, path: resolvedModuleSpecifier}));
	}
}
