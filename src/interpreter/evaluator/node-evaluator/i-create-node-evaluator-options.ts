import type {Logger} from "../../logger/logger.js";
import type {Stack} from "../../stack/stack.js";
import type {EvaluatePolicySanitized} from "../../policy/evaluate-policy.js";
import type {ReportingOptionsSanitized} from "../../reporting/i-reporting-options.js";
import type {TS} from "../../../type/ts.js";
import type { EvaluationError, ThrowError } from "../../error/evaluation-error/evaluation-error.js";
import type { LexicalEnvironment } from "../../lexical-environment/lexical-environment.js";
import type { StatementTraversalStack } from "../../stack/traversal-stack/statement-traversal-stack.js";

export interface ICreateNodeEvaluatorOptions {
	typeChecker?: TS.TypeChecker;
	typescript: typeof TS;
	policy: EvaluatePolicySanitized;
	reporting: ReportingOptionsSanitized;
	moduleOverrides?: Record<string, unknown>;
	logger: Logger;
	stack: Stack;
	statementTraversalStack: StatementTraversalStack;
	environment: LexicalEnvironment;
	throwError: ThrowError;
	getCurrentError (): EvaluationError|undefined;
}
