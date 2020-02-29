import {IEvaluationErrorOptions} from "../../evaluation-error/i-evaluation-error-options";

export interface INetworkErrorOptions extends IEvaluationErrorOptions {
	operation: string;
}
