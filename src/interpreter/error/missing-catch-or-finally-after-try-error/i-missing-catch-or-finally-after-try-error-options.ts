import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import {TS} from "../../../type/ts.js";

export interface IMissingCatchOrFinallyAfterTryErrorOptions extends IEvaluationErrorOptions {
	node: TS.TryStatement;
}
