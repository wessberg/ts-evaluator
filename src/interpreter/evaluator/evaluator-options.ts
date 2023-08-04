import type {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import type {NodeEvaluator} from "./node-evaluator/node-evaluator.js";
import type {Logger} from "../logger/logger.js";
import type {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack.js";
import type {Stack} from "../stack/stack.js";
import type {EvaluatePolicySanitized} from "../policy/evaluate-policy.js";
import type {ReportingOptionsSanitized} from "../reporting/i-reporting-options.js";
import type {TS} from "../../type/ts.js";
import type {EvaluationError, ThrowError} from "../error/evaluation-error/evaluation-error.js";

export interface NextEvaluatorOptions {
	environment: LexicalEnvironment;
	moduleOverrides?: Record<string, unknown>;
	throwError: ThrowError;
	getCurrentError(): EvaluationError | undefined;
	statementTraversalStack: StatementTraversalStack;
}

export interface EvaluatorOptions<T extends TS.Node | TS.NodeArray<TS.Node>> extends NextEvaluatorOptions {
	typescript: typeof TS;
	node: T;
	evaluate: NodeEvaluator;
	typeChecker?: TS.TypeChecker;
	stack: Stack;
	logger: Logger;
	policy: EvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
}
