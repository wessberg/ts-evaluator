import type {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";

export interface INonDeterministicErrorOptions extends IEvaluationErrorOptions {
	operation: string;
}
