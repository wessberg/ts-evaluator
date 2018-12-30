import {TryStatement} from "typescript";
import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";

export interface IMissingCatchOrFinallyAfterTryErrorOptions extends IEvaluationErrorOptions {
	node: TryStatement;
}