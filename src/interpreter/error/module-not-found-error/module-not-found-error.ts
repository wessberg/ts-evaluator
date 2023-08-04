import {EvaluationError} from "../evaluation-error/evaluation-error.js";
import type {IModuleNotFoundErrorOptions} from "./i-module-not-found-error-options.js";

/**
 * An Error that can be thrown when a moduleSpecifier couldn't be resolved
 */
export class ModuleNotFoundError extends EvaluationError {
	/**
	 * The path/moduleName that could not be resolved
	 */
	readonly path: string;

	constructor({path, node, environment, message = `Module '${path}' could not be resolved'`}: IModuleNotFoundErrorOptions) {
		super({message, environment, node});
		this.path = path;
	}
}
