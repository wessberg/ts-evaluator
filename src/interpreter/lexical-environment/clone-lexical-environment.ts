import { TS } from "../../type/ts.js";
import {LexicalEnvironment} from "./lexical-environment.js";

/**
 * Clones the given LexicalEnvironment
 */
export function cloneLexicalEnvironment(environment: LexicalEnvironment, startingNode: TS.Node): LexicalEnvironment {
	return {
		parentEnv: environment,
		startingNode,		
		env: {}
	};
}
