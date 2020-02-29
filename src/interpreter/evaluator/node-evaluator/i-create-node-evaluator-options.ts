import {Logger} from "../../logger/logger";
import {Stack} from "../../stack/stack";
import {IEvaluatePolicySanitized} from "../../policy/i-evaluate-policy";
import {ReportingOptionsSanitized} from "../../reporting/i-reporting-options";
import {TS} from "../../../type/ts";

export interface ICreateNodeEvaluatorOptions {
	typeChecker: TS.TypeChecker;
	typescript: typeof TS;
	policy: IEvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
	logger: Logger;
	stack: Stack;
	nextNode(node: TS.Node): void;
}
