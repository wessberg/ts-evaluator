import {LexicalEnvironment} from "../lexical-environment/lexical-environment";
import {NodeEvaluator} from "./node-evaluator/node-evaluator";
import {Logger} from "../logger/logger";
import {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";
import {Stack} from "../stack/stack";
import {EvaluatePolicySanitized} from "../policy/evaluate-policy";
import {ReportingOptionsSanitized} from "../reporting/i-reporting-options";
import {TS} from "../../type/ts";

export interface EvaluatorOptions<T extends TS.Node | TS.NodeArray<TS.Node>> {
	node: T;
	typeChecker: TS.TypeChecker;
	typescript: typeof TS;
	evaluate: NodeEvaluator;
	environment: LexicalEnvironment;
	policy: EvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
	stack: Stack;
	statementTraversalStack: StatementTraversalStack;
	logger: Logger;
}
