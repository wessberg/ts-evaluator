import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";

export interface IMaxOpDurationExceededErrorOptions extends IEvaluationErrorOptions {
	duration: number;
}
