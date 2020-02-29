import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {TS} from "../../../type/ts";

export interface IAsyncIteratorNotSupportedErrorOptions extends Omit<IEvaluationErrorOptions, "node"> {
	typescript: typeof TS;
}
