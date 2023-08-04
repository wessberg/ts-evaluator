import type {IEvaluationErrorOptions} from "../evaluation-error/i-evaluation-error-options.js";
import type {Literal} from "../../literal/literal.js";

export interface INotCallableErrorOptions extends IEvaluationErrorOptions {
	value: Literal;
}
