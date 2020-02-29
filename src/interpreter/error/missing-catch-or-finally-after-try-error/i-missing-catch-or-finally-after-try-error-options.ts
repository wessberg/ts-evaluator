import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {TS} from "../../../type/ts";

export interface IMissingCatchOrFinallyAfterTryErrorOptions extends IEvaluationErrorOptions {
	node: TS.TryStatement;
}