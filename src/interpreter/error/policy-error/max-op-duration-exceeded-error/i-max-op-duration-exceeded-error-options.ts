import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";

export interface IMaxOpDurationExceededErrorOptions extends IEvaluationErrorOptions {
	duration: number;
}