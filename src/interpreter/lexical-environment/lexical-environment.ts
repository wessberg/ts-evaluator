import {IndexLiteral, Literal, LiteralMatch} from "../literal/literal";
import {del, get, has, set} from "object-path";
import {createSanitizedEnvironment} from "../environment/create-sanitized-environment";
import {ECMA_GLOBALS} from "../environment/ecma/ecma-globals";
import {NODE_GLOBALS} from "../environment/node/node-globals";
import {EnvironmentPresetKind} from "../environment/environment-preset-kind";
import {BROWSER_GLOBALS} from "../environment/browser/browser-globals";
import {mergeDescriptors} from "../util/descriptor/merge-descriptors";
import {ISetInLexicalEnvironmentOptions} from "./i-set-in-lexical-environment-options";
import {RETURN_SYMBOL} from "../util/return/return-symbol";
import {BREAK_SYMBOL} from "../util/break/break-symbol";
import {CONTINUE_SYMBOL} from "../util/continue/continue-symbol";
import {THIS_SYMBOL} from "../util/this/this-symbol";
import {SUPER_SYMBOL} from "../util/super/super-symbol";
import {ICreateLexicalEnvironmentOptions} from "./i-create-lexical-environment-options";
import {TS} from "../../type/ts";

export interface LexicalEnvironment {
	parentEnv: LexicalEnvironment | undefined;
	env: IndexLiteral;
	preset?: EnvironmentPresetKind;
}

/**
 * Gets a value from a Lexical Environment
 *
 * @param env
 * @param path
 * @returns
 */
export function getRelevantDictFromLexicalEnvironment(env: LexicalEnvironment, path: string): LexicalEnvironment["env"] | undefined {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) return env.env;
	if (env.parentEnv != null) return getRelevantDictFromLexicalEnvironment(env.parentEnv, path);
	return undefined;
}

/**
 * Gets the EnvironmentPresetKind for the given LexicalEnvironment
 */
export function getPresetForLexicalEnvironment(env: LexicalEnvironment): EnvironmentPresetKind {
	if (env.preset != null) return env.preset;
	else if (env.parentEnv != null) return getPresetForLexicalEnvironment(env.parentEnv);
	else return EnvironmentPresetKind.NONE;
}

/**
 * Gets a value from a Lexical Environment
 */
export function getFromLexicalEnvironment(node: TS.Node | undefined, env: LexicalEnvironment, path: string): LiteralMatch | undefined {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) {
		const literal = get(env.env, path);
		switch (path) {
			// If we're in a Node environment, the "__dirname" and "__filename" meta-properties should report the current directory or file of the SourceFile and not the parent process
			case "__dirname":
			case "__filename": {
				const preset = getPresetForLexicalEnvironment(env);
				return preset === EnvironmentPresetKind.NODE && typeof literal === "function" && node != null
					? {literal: literal(node.getSourceFile().fileName)}
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
 *
 * @param value
 * @return
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
 *
 * @param options
 * @param [newBinding=false]
 */
export function setInLexicalEnvironment({env, path, value, reporting, node, newBinding = false}: ISetInLexicalEnvironmentOptions): void {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding) || newBinding || env.parentEnv == null) {
		// If the value didn't change, do no more
		if (has(env.env, path) && get(env.env, path) === value) return;

		// Otherwise, mutate it
		set(env.env, path, value);

		// Inform reporting hooks if any is given
		if (reporting.reportBindings != null && !isInternalSymbol(path)) {
			reporting.reportBindings({path, value, node});
		}
	} else {
		let currentParentEnv: LexicalEnvironment | undefined = env.parentEnv;
		while (currentParentEnv != null) {
			if (has(currentParentEnv.env, firstBinding)) {
				// If the value didn't change, do no more
				if (has(currentParentEnv.env, path) && get(currentParentEnv.env, path) === value) return;

				// Otherwise, mutate it
				set(currentParentEnv.env, path, value);

				// Inform reporting hooks if any is given
				if (reporting.reportBindings != null && !isInternalSymbol(path)) {
					reporting.reportBindings({path, value, node});
				}
				return;
			} else {
				currentParentEnv = currentParentEnv.parentEnv;
			}
		}
	}
}

/**
 * Clears a binding from a Lexical Environment
 *
 * @param env
 * @param path
 */
export function clearBindingFromLexicalEnvironment(env: LexicalEnvironment, path: string): void {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) {
		del(env.env, path);
	} else {
		let currentParentEnv: LexicalEnvironment | undefined = env.parentEnv;
		while (currentParentEnv != null) {
			if (has(currentParentEnv.env, firstBinding)) {
				del(currentParentEnv.env, path);
				return;
			} else {
				currentParentEnv = currentParentEnv.parentEnv;
			}
		}
	}
}

/**
 * Creates a Lexical Environment
 *
 * @param options
 * @returns
 */
export function createLexicalEnvironment({
	inputEnvironment: {extra, preset},
	policy,
	getCurrentNode
}: ICreateLexicalEnvironmentOptions): LexicalEnvironment {
	let envInput: IndexLiteral;

	switch (preset) {
		case EnvironmentPresetKind.NONE:
			envInput = mergeDescriptors(extra);
			break;

		case EnvironmentPresetKind.ECMA:
			envInput = mergeDescriptors(ECMA_GLOBALS(), extra);
			break;

		case EnvironmentPresetKind.NODE:
			envInput = mergeDescriptors(NODE_GLOBALS(), extra);
			break;

		case EnvironmentPresetKind.BROWSER:
			envInput = mergeDescriptors(BROWSER_GLOBALS(), extra);
			break;

		default:
			envInput = {};
			break;
	}

	return {
		preset,
		parentEnv: undefined,
		env: createSanitizedEnvironment({
			policy,
			env: envInput,
			getCurrentNode
		})
	};
}
