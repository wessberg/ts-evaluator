import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import {TS} from "../../../type/ts.js";

export interface IUnexpectedNodeErrorOptions extends IEvaluationErrorOptions {
	typescript: typeof TS;
}
