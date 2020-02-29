import {LexicalEnvironment} from "./lexical-environment";

/**
 * Clones the given LexicalEnvironment
 */
export function cloneLexicalEnvironment(environment: LexicalEnvironment): LexicalEnvironment {
	return {
		parentEnv: environment,
		env: {}
	};
}
