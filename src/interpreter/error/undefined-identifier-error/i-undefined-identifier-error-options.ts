import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import {TS} from "../../../type/ts.js";

export interface IUndefinedIdentifierErrorOptions extends IEvaluationErrorOptions {
	node: TS.Identifier | TS.PrivateIdentifier;
}
