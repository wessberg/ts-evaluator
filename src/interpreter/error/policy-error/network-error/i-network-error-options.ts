import type {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options.js";

export interface INetworkErrorOptions extends IEvaluationErrorOptions {
	operation: string;
}
