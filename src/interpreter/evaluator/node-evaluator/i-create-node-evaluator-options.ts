import {TypeChecker} from "typescript";
import {Logger} from "../../logger/logger";
import {Stack} from "../../stack/stack";
import {IEvaluatePolicySanitized} from "../../policy/i-evaluate-policy";

export interface ICreateNodeEvaluatorOptions {
	typeChecker: TypeChecker;
	policy: IEvaluatePolicySanitized;
	logger: Logger;
	stack: Stack;
	require: NodeRequire;
}