import objectPath from "object-path";
import type {IndexLiteral, Literal, LiteralMatch} from "../literal/literal.js";
import {ECMA_GLOBALS} from "../environment/ecma/ecma-globals.js";
import {NODE_CJS_GLOBALS} from "../environment/node/node-cjs-globals.js";
import type {EnvironmentPresetKind} from "../environment/environment-preset-kind.js";
import {BROWSER_GLOBALS} from "../environment/browser/browser-globals.js";
import {mergeDescriptors} from "../util/descriptor/merge-descriptors.js";
import type {ISetInLexicalEnvironmentOptions} from "./i-set-in-lexical-environment-options.js";
import {RETURN_SYMBOL} from "../util/return/return-symbol.js";
import {BREAK_SYMBOL} from "../util/break/break-symbol.js";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol.js";
import {THIS_SYMBOL} from "../util/this/this-symbol.js";
import {SUPER_SYMBOL} from "../util/super/super-symbol.js";
import type {ICreateLexicalEnvironmentOptions} from "./i-create-lexical-environment-options.js";
import type {TS} from "../../type/ts.js";
import {NODE_ESM_GLOBALS} from "../environment/node/node-esm-globals.js";
import {getStatementContext} from "../util/node/find-nearest-parent-node-of-kind.js";
import {createSanitizedEnvironment} from "../environment/create-sanitized-environment.js";

export interface LexicalEnvironment {
	parentEnv: LexicalEnvironment | undefined;
	env: IndexLiteral;
	startingNode: TS.Node;
	preset?: EnvironmentPresetKind;
}

/**
 * Gets a value from a Lexical Environment
 */
export function getRelevantDictFromLexicalEnvironment(env: LexicalEnvironment, path: string): LexicalEnvironment["env"] | undefined {
	const [firstBinding] = path.split(".");
	if (objectPath.has(env.env, firstBinding)) return env.env;
	if (env.parentEnv != null) return getRelevantDictFromLexicalEnvironment(env.parentEnv, path);
	return undefined;
}

/**
 * Gets the EnvironmentPresetKind for the given LexicalEnvironment
 */
export function getPresetForLexicalEnvironment(env: LexicalEnvironment): EnvironmentPresetKind {
	if (env.preset != null) return env.preset;
	else if (env.parentEnv != null) return getPresetForLexicalEnvironment(env.parentEnv);
	else return "NONE";
}

/**
 * Gets a value from a Lexical Environment
 */
export function findLexicalEnvironmentUp(from: LexicalEnvironment, path: string): LexicalEnvironment | undefined {
	const [firstBinding] = path.split(".");
	if (objectPath.has(from.env, firstBinding)) return from;
	if (from.parentEnv != null) return findLexicalEnvironmentUp(from.parentEnv, path);
	return undefined;
}

export function findLexicalEnvironmentInSameContext(from: LexicalEnvironment, node: TS.Node, typescript: typeof TS): LexicalEnvironment | undefined {
	const startingNodeContext = getStatementContext(from.startingNode, typescript);
	const nodeContext = getStatementContext(node, typescript);

	if (startingNodeContext?.pos === nodeContext?.pos) {
		return from;
	}

	if (from.parentEnv == null) {
		return undefined;
	}

	return findLexicalEnvironmentInSameContext(from.parentEnv, node, typescript);
}

/**
 * Gets a value from a Lexical Environment
 */
export function getFromLexicalEnvironment(node: TS.Node | undefined, env: LexicalEnvironment, path: string): LiteralMatch | undefined {
	const [firstBinding] = path.split(".");
	if (objectPath.has(env.env, firstBinding)) {
		const literal = objectPath.get(env.env, path);
		switch (path) {
			// If we're in a Node environment, the "__dirname" and "__filename" meta-properties should report the current directory or file of the SourceFile and not the parent process
			case "__dirname":
			case "__filename": {
				const preset = getPresetForLexicalEnvironment(env);
				return (preset === "NODE" || preset === "NODE_CJS") && typeof literal === "function" && node != null ? {literal: literal(node.getSourceFile().fileName)} : {literal};
			}
			case "import.meta": {
				const preset = getPresetForLexicalEnvironment(env);
				return (preset === "NODE_ESM" || preset === "BROWSER" || preset === "ECMA") &&
					typeof literal === "object" &&
					literal != null &&
					typeof literal.url === "function" &&
					node != null
					? {literal: {url: literal.url(node.getSourceFile().fileName)}}
					: {literal};
			}
			default:
				return {literal};
		}
	}

	if (env.parentEnv != null) return getFromLexicalEnvironment(node, env.parentEnv, path);
	return undefined;
}

/**
 * Returns true if a path maps to an identifier that has been declared within the Lexical Environment
 */
export function hasInLexicalEnvironment(node: TS.Node | undefined, env: LexicalEnvironment, path: string): boolean {
	const [firstBinding] = path.split(".");
	if (objectPath.has(env.env, firstBinding)) {
		return true;
	}

	if (env.parentEnv != null) {
		return hasInLexicalEnvironment(node, env.parentEnv, path);
	}
	return false;
}

/**
 * Returns true if the given lexical environment contains a value on the given path that equals the given literal
 */
export function pathInLexicalEnvironmentEquals(node: TS.Node, env: LexicalEnvironment, equals: Literal, ...matchPaths: string[]): boolean {
	return matchPaths.some(path => {
		const match = getFromLexicalEnvironment(node, env, path);
		return match == null ? false : match.literal === equals;
	});
}

/**
 * Returns true if the given value represents an internal symbol
 */
export function isInternalSymbol(value: Literal): boolean {
	switch (value) {
		case RETURN_SYMBOL:
		case BREAK_SYMBOL:
		case CONTINUE_SYMBOL:
		case THIS_SYMBOL:
		case SUPER_SYMBOL:
			return true;
		default:
			return false;
	}
}

/**
 * Gets a value from a Lexical Environment
 */
export function setInLexicalEnvironment({environment, path, value, reporting, node, newBinding = false}: ISetInLexicalEnvironmentOptions): void {
	const [firstBinding] = path.split(".");

	if (objectPath.has(environment.env, firstBinding) || newBinding || environment.parentEnv == null) {
		// If the value didn't change, do no more
		if (objectPath.has(environment.env, path) && objectPath.get(environment.env, path) === value) return;

		// Otherwise, mutate it
		objectPath.set(environment.env, path, value);

		// Inform reporting hooks if any is given
		if (reporting.reportBindings != null && !isInternalSymbol(path)) {
			reporting.reportBindings({path, value, node});
		}
	} else {
		let currentParentEnv: LexicalEnvironment | undefined = environment.parentEnv;
		while (currentParentEnv != null) {
			if (objectPath.has(currentParentEnv.env, firstBinding)) {
				// If the value didn't change, do no more
				if (objectPath.has(currentParentEnv.env, path) && objectPath.get(currentParentEnv.env, path) === value) return;

				// Otherwise, mutate it
				objectPath.set(currentParentEnv.env, path, value);

				// Inform reporting hooks if any is given
				if (reporting.reportBindings != null && !isInternalSymbol(path)) {
					reporting.reportBindings({path, value, node});
				}
				return;
			} else {
				if (currentParentEnv.parentEnv == null) {
					// Otherwise, mutate it
					objectPath.set(currentParentEnv.env, path, value);

					// Inform reporting hooks if any is given
					if (reporting.reportBindings != null && !isInternalSymbol(path)) {
						reporting.reportBindings({path, value, node});
					}
				} else {
					currentParentEnv = currentParentEnv.parentEnv;
				}
			}
		}
	}
}

/**
 * Clears a binding from a Lexical Environment
 */
export function clearBindingFromLexicalEnvironment(env: LexicalEnvironment, path: string): void {
	const [firstBinding] = path.split(".");
	if (objectPath.has(env.env, firstBinding)) {
		objectPath.del(env.env, path);
	} else {
		let currentParentEnv: LexicalEnvironment | undefined = env.parentEnv;
		while (currentParentEnv != null) {
			if (objectPath.has(currentParentEnv.env, firstBinding)) {
				objectPath.del(currentParentEnv.env, path);
				return;
			} else {
				currentParentEnv = currentParentEnv.parentEnv;
			}
		}
	}
}

export function simplifyEnvironment(environment: LexicalEnvironment, typescript: typeof TS): Record<string, unknown> {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const {arguments: _arguments, ...rest} = environment.env;

	const strippedEnv = Object.fromEntries(Object.entries(rest).filter(([key]) => !(key in globalThis)));

	return {
		...(environment.preset == null ? {} : {preset: environment.preset}),
		parentEnv: environment.parentEnv == null ? undefined : simplifyEnvironment(environment.parentEnv, typescript),
		env: environment.preset != null ? strippedEnv : rest,
		startingNode: typescript.SyntaxKind[environment.startingNode.kind]
	};
}

/**
 * Creates a Lexical Environment
 */
export function createLexicalEnvironment({inputEnvironment: {extra, preset}, startingNode, policy}: ICreateLexicalEnvironmentOptions): LexicalEnvironment {
	let env: IndexLiteral;

	switch (preset) {
		case "NONE":
			env = mergeDescriptors(extra);
			break;

		case "ECMA":
			env = mergeDescriptors(ECMA_GLOBALS(), extra);
			break;

		case "NODE":
		case "NODE_CJS":
			env = mergeDescriptors(NODE_CJS_GLOBALS(), extra);
			break;

		case "NODE_ESM":
			env = mergeDescriptors(NODE_ESM_GLOBALS(), extra);
			break;

		case "BROWSER":
			env = mergeDescriptors(BROWSER_GLOBALS(), extra);
			break;

		default:
			env = {};
			break;
	}

	return {
		parentEnv: undefined,
		preset,
		startingNode,
		env: createSanitizedEnvironment({
			policy,
			env
		})
	};
}
