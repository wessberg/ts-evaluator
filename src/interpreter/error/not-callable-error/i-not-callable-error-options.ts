import {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import {Literal} from "../../literal/literal.js";

export interface INotCallableErrorOptions extends IEvaluationErrorOptions {
	value: Literal;
}
