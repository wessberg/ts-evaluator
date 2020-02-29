import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {TS} from "../../../type/ts";

export interface IUndefinedIdentifierErrorOptions extends IEvaluationErrorOptions {
	node: TS.Identifier | TS.PrivateIdentifier;
}
