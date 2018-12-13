// @ts-ignore
import {builtinModules} from "module";

/**
 * Returns true if the given moduleName is a built-in module
 * @param {string} moduleName
 * @return {boolean}
 */
export function isBuiltInModule (moduleName: string): boolean {
	return builtinModules.includes(moduleName);
}