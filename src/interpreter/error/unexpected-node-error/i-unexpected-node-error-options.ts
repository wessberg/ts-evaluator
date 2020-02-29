import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {TS} from "../../../type/ts";

export interface IUnexpectedNodeErrorOptions extends IEvaluationErrorOptions {
	typescript: typeof TS;
}