import type {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import type {TS} from "../../../type/ts.js";

export interface IUnexpectedNodeErrorOptions extends IEvaluationErrorOptions {
	typescript: typeof TS;
}
