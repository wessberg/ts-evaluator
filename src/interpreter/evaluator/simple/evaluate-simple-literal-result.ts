import {Literal} from "../../literal/literal.js";

export interface IEvaluateSimpleLiteralResultBase {
	success: boolean;
}

export interface IEvaluateSimpleLiteralSuccessResult extends IEvaluateSimpleLiteralResultBase {
	success: true;
	value: Literal;
}

export interface IEvaluateSimpleLiteralFailureResult extends IEvaluateSimpleLiteralResultBase {
	success: false;
}

export type EvaluateSimpleLiteralResult = IEvaluateSimpleLiteralSuccessResult | IEvaluateSimpleLiteralFailureResult;
