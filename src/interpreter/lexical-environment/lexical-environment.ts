import {Node, NodeArray} from "typescript";
import {IndexLiteral, Literal, LiteralMatch} from "../literal/literal";
import {del, get, has, set} from "object-path";
import {GLOBAL_SYMBOL, GLOBAL_THIS_SYMBOL} from "../util/global/global-symbol";
import {console} from "./lib/shared/console";
import {Logger} from "../logger/logger";
import {IEvaluatePolicySanitized} from "../policy/i-evaluate-policy";
import {createProxyBaseEnvironment} from "../environment/create-proxy-base-environment";

export interface LexicalEnvironment {
	parentEnv: LexicalEnvironment|undefined;
	env: IndexLiteral;
}

const LEXICAL_ENVIRONMENT_MAP: WeakMap<Node|NodeArray<Node>, LexicalEnvironment> = new WeakMap();

/**
 * Returns true if a lexical environment has been computed for the given Node
 * @param {T} node
 * @returns {boolean}
 */
export function hasLexicalEnvironmentForNode<T extends Node> (node: T): boolean {
	return LEXICAL_ENVIRONMENT_MAP.has(node);
}

/**
 * Gets a value from a Lexical Environment
 * @param {LexicalEnvironment} env
 * @param {string} path
 * @returns {LexicalEnvironment["env]|undefined}
 */
export function getRelevantDictFromLexicalEnvironment (env: LexicalEnvironment, path: string): LexicalEnvironment["env"]|undefined {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) return env.env;
	if (env.parentEnv != null) return getRelevantDictFromLexicalEnvironment(env.parentEnv, path);
	return undefined;
}

/**
 * Gets a value from a Lexical Environment
 * @param {LexicalEnvironment} env
 * @param {string} path
 * @returns {LiteralMatch?}
 */
export function getFromLexicalEnvironment (env: LexicalEnvironment, path: string): LiteralMatch|undefined {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) return {literal: get(env.env, path)};
	if (env.parentEnv != null) return getFromLexicalEnvironment(env.parentEnv, path);
	return undefined;
}

/**
 * Returns true if the Lexical Environment includes a value on the given path
 * @param {LexicalEnvironment} env
 * @param {string} path
 * @returns {LiteralMatch?}
 */
export function hasInLexicalEnvironment (env: LexicalEnvironment, path: string): boolean {
	return getFromLexicalEnvironment(env, path) != null;
}

/**
 * Returns true if the given lexical environment contains a value on the given path that equals the given literal
 * @param {LexicalEnvironment} env
 * @param {Literal} equals
 * @param {string[]} matchPaths
 * @returns {boolean}
 */
export function pathInLexicalEnvironmentEquals (env: LexicalEnvironment, equals: Literal, ...matchPaths: string[]): boolean {
	return matchPaths.some(path => {
		const match = getFromLexicalEnvironment(env, path);
		return match == null ? false : match.literal === equals;
	});
}

/**
 * Gets a value from a Lexical Environment
 * @param {LexicalEnvironment} env
 * @param {string} path
 * @param {Literal} value
 * @param {boolean} [newBinding=false]
 */
export function setInLexicalEnvironment (env: LexicalEnvironment, path: string, value: Literal, newBinding: boolean = false): void {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding) || newBinding || env.parentEnv == null) {
		set(env.env, path, value);
	}

	else {
		let currentParentEnv: LexicalEnvironment|undefined = env.parentEnv;
		while (currentParentEnv != null) {
			if (has(currentParentEnv.env, firstBinding)) {
				set(currentParentEnv.env, path, value);
				return;
			}
			else {
				currentParentEnv = currentParentEnv.parentEnv;
			}
		}
	}
}

/**
 * Clears a binding from a Lexical Environment
 * @param {LexicalEnvironment} env
 * @param {string} path
 */
export function clearBindingFromLexicalEnvironment (env: LexicalEnvironment, path: string): void {
	const [firstBinding] = path.split(".");
	if (has(env.env, firstBinding)) {
		del(firstBinding);
	}

	else {
		let currentParentEnv: LexicalEnvironment|undefined = env.parentEnv;
		while (currentParentEnv != null) {
			if (has(currentParentEnv.env, firstBinding)) {
				del(currentParentEnv.env, path);
				return;
			}
			else {
				currentParentEnv = currentParentEnv.parentEnv;
			}
		}
	}
}

/**
 * Gets the Lexical Environment for the given node
 * @param {Node} node
 * @param {LexicalEnvironment} lexicalEnvironment
 * @returns {LexicalEnvironment}
 */
export function setLexicalEnvironmentForNode<T extends Node, U extends (T|NodeArray<T>) = T> (node: U, lexicalEnvironment: LexicalEnvironment): LexicalEnvironment {
	LEXICAL_ENVIRONMENT_MAP.set(node, lexicalEnvironment);
	return lexicalEnvironment;
}

/**
 * Creates a Lexical Environment
 * @param {LexicalEnvironment["env]} inputEnvironment
 * @param {IEvaluatePolicySanitized} policy
 * @param {Logger} logger
 * @returns {Promise<LexicalEnvironment>}
 */
export function createLexicalEnvironment (inputEnvironment: LexicalEnvironment["env"], policy: IEvaluatePolicySanitized, logger: Logger): LexicalEnvironment {

	const environment = {
		parentEnv: undefined,
		env: {
			...createProxyBaseEnvironment(policy),
			console: console(logger),
			...inputEnvironment
		} as IndexLiteral
	};

	environment.env[GLOBAL_SYMBOL] = environment.env[GLOBAL_THIS_SYMBOL] = environment;
	return environment;
}