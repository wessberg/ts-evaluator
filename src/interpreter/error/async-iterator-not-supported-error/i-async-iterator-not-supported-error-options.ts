import type {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import type {TS} from "../../../type/ts.js";

export interface IAsyncIteratorNotSupportedErrorOptions extends Omit<IEvaluationErrorOptions, "node"> {
	typescript: typeof TS;
}
