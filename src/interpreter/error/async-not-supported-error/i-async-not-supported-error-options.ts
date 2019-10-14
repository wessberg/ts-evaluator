import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";

export interface IAsyncNotSupportedErrorOptions extends Omit<IEvaluationErrorOptions, "node"> {
}