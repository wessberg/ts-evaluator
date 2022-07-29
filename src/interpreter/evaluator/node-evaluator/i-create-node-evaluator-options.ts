import {Logger} from "../../logger/logger.js";
import {Stack} from "../../stack/stack.js";
import {EvaluatePolicySanitized} from "../../policy/evaluate-policy.js";
import {ReportingOptionsSanitized} from "../../reporting/i-reporting-options.js";
import {TS} from "../../../type/ts.js";
import { EvaluationError, ThrowError } from "../../error/evaluation-error/evaluation-error.js";
import { LexicalEnvironment } from "../../lexical-environment/lexical-environment.js";
import { StatementTraversalStack } from "../../stack/traversal-stack/statement-traversal-stack.js";

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
