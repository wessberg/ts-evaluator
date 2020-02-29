import {getFromLexicalEnvironment, LexicalEnvironment} from "../../lexical-environment/lexical-environment";

/**
 * Returns true if the given function is either Function.prototype.bind, Function.prototype.call, or Function.prototype.apply
 *
 * @param func
 * @param [environment]
 * @return
 */
export function isBindCallApply(func: Function, environment?: LexicalEnvironment): boolean {
	switch (func) {
		case Function.prototype.bind:
		case Function.prototype.call:
		case Function.prototype.apply:
			return true;
	}

	if (environment != null) {
		const _Function = getFromLexicalEnvironment(undefined, environment, "Function")!.literal as Function;
		switch (func) {
			case _Function.prototype.bind:
			case _Function.prototype.call:
			case _Function.prototype.apply:
				return true;
		}
	}
	return false;
}
