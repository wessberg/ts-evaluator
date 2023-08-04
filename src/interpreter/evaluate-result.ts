import type {EvaluationError} from "./error/evaluation-error/evaluation-error.js";

export interface IEvaluateResultBase {
	success: boolean;
}

export interface IEvaluateSuccessResult extends IEvaluateResultBase {
	success: true;
	value: unknown;
}

export interface IEvaluateFailureResult extends IEvaluateResultBase {
	success: false;
	reason: EvaluationError;
}

export type EvaluateResult = IEvaluateSuccessResult | IEvaluateFailureResult;
