import {EvaluationError} from "../evaluation-error/evaluation-error";
import {IModuleNotFoundErrorOptions} from "./i-module-not-found-error-options";

/**
 * An Error that can be thrown when a moduleSpecifier couldn't be resolved
 */
export class ModuleNotFoundError extends EvaluationError {
	/**
	 * The path/moduleName that could not be resolved
	 * @type {string}
	 */
	public readonly path: string;

	constructor({path, node, message = `Module '${path}' could not be resolved'`}: IModuleNotFoundErrorOptions) {
		super({message, node});
		this.path = path;
	}
}
