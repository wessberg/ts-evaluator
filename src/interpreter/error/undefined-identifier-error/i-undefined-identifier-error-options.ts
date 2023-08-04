import type {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import type {TS} from "../../../type/ts.js";

export interface IUndefinedIdentifierErrorOptions extends IEvaluationErrorOptions {
	node: TS.Identifier | TS.PrivateIdentifier;
}
