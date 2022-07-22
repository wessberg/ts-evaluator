import {Logger} from "../../logger/logger.js";
import {Stack} from "../../stack/stack.js";
import {EvaluatePolicySanitized} from "../../policy/evaluate-policy.js";
import {ReportingOptionsSanitized} from "../../reporting/i-reporting-options.js";
import {TS} from "../../../type/ts.js";

export interface ICreateNodeEvaluatorOptions {
	typeChecker?: TS.TypeChecker;
	typescript: typeof TS;
	policy: EvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
	logger: Logger;
	stack: Stack;
	nextNode(node: TS.Node): void;
}
