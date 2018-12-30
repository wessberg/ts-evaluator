import {Node, TypeChecker} from "typescript";
import {Logger} from "../../logger/logger";
import {Stack} from "../../stack/stack";
import {IEvaluatePolicySanitized} from "../../policy/i-evaluate-policy";
import {ReportingOptionsSanitized} from "../../reporting/i-reporting-options";

export interface ICreateNodeEvaluatorOptions {
	typeChecker: TypeChecker;
	policy: IEvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
	logger: Logger;
	stack: Stack;
	nextNode (node: Node): void;
}