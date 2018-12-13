import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options";
import {Literal} from "../../literal/literal";

export interface INotCallableErrorOptions extends IEvaluationErrorOptions {
	value: Literal;
}