import {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {NodeEvaluator} from "./node-evaluator/node-evaluator.js";
import {Logger} from "../logger/logger.js";
import {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack.js";
import {Stack} from "../stack/stack.js";
import {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import {ReportingOptionsSanitized} from "../reporting/i-reporting-options.js";
import {TS} from "../../type/ts.js";

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
