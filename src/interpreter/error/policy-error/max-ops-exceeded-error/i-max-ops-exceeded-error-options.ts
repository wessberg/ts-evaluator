import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";

export interface IMaxOpsExceededErrorOptions extends IEvaluationErrorOptions {
	ops: number;
}
