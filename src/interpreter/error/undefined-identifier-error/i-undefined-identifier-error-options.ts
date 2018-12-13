import {Identifier} from "typescript";
import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";

export interface IUndefinedIdentifierErrorOptions extends IEvaluationErrorOptions {
	identifier: Identifier;
}