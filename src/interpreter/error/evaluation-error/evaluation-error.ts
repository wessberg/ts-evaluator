import type {IEvaluationErrorOptions} from "./i-evaluation-error-options.js";
import type {TS} from "../../../type/ts.js";
import type { LexicalEnvironment } from "../../lexical-environment/lexical-environment.js";

export type ThrowError = (error: EvaluationError) => EvaluationError;

/**
 * A Base class for EvaluationErrors
 */
export class EvaluationError extends Error {
	/**
	 * The node that caused or thew the error
	 */
	readonly node: TS.Node;
	readonly environment: LexicalEnvironment;

	constructor({node, environment, message}: IEvaluationErrorOptions) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.node = node;
		this.environment = environment;
	}
}

export function isEvaluationError (item: unknown): item is EvaluationError {
	return typeof item === "object" && item != null && item instanceof EvaluationError;
}