import * as TSModule from "typescript";
import type {EvaluateOptions} from "./evaluate-options.js";
import {createLexicalEnvironment} from "./lexical-environment/lexical-environment.js";
import type {EvaluateResult} from "./evaluate-result.js";
import {evaluateSimpleLiteral} from "./evaluator/simple/evaluate-simple-literal.js";
import {createNodeEvaluator} from "./evaluator/node-evaluator/create-node-evaluator.js";
import {LogLevelKind} from "./logger/log-level.js";
import {Logger} from "./logger/logger.js";
import {createStatementTraversalStack} from "./stack/traversal-stack/statement-traversal-stack.js";
import {isExpression} from "./util/expression/is-expression.js";
import type {Literal} from "./literal/literal.js";
import {isStatement} from "./util/statement/is-statement.js";
import type {Stack} from "./stack/stack.js";
import {createStack} from "./stack/stack.js";
import {isDeclaration} from "./util/declaration/is-declaration.js";
import {UnexpectedNodeError} from "./error/unexpected-node-error/unexpected-node-error.js";
import type {EvaluatePolicySanitized} from "./policy/evaluate-policy.js";
import {reportError} from "./util/reporting/report-error.js";
import {createReportedErrorSet} from "./reporting/reported-error-set.js";
import type {ReportingOptionsSanitized} from "./reporting/i-reporting-options.js";
import type {EvaluationError, ThrowError} from "./error/evaluation-error/evaluation-error.js";
import type {ICreateNodeEvaluatorOptions} from "./evaluator/node-evaluator/i-create-node-evaluator-options.js";
/**
 * Will get a literal value for the given Expression, ExpressionStatement, or Declaration.
 */
export function evaluate({
	typeChecker,
	node,
	environment: {preset = "NODE", extra = {}} = {},
	moduleOverrides = {},
	typescript = TSModule,
	logLevel = LogLevelKind.SILENT,
	policy: {
		deterministic = false,
		network = false,
		console = false,
		maxOps = Infinity,
		maxOpDuration = Infinity,
		io = {
			read: true,
			write: false
		},
		process = {
			exit: false,
			spawnChild: false
		}
	} = {},
	reporting: reportingInput = {}
}: EvaluateOptions): EvaluateResult {
	// Take the simple path first. This may be far more performant than building up an environment
	const simpleLiteralResult = evaluateSimpleLiteral(node, typescript);
	if (simpleLiteralResult.success) return simpleLiteralResult;

	// Otherwise, build an environment and get to work
	// Sanitize the evaluation policy based on the input options
	const policy: EvaluatePolicySanitized = {
		deterministic,
		maxOps,
		maxOpDuration,
		network,
		console,
		io: {
			read: typeof io === "boolean" ? io : io.read,
			write: typeof io === "boolean" ? io : io.write
		},
		process: {
			exit: typeof process === "boolean" ? process : process.exit,
			spawnChild: typeof process === "boolean" ? process : process.spawnChild
		}
	};

	// Sanitize the Reporting options based on the input options
	const reporting: ReportingOptionsSanitized = {
		...reportingInput,
		reportedErrorSet: createReportedErrorSet()
	};

	/**
	 * The error that has been thrown most recently.
	 * We can' just throw errors internally, as some tools may patch error handling
	 * and treat them as uncaught exceptions, which breaks the behavior of evaluate,
	 * which never throws and instead returns a record with a {success: false, reason: Error} value.
	 */
	let error: EvaluationError | undefined;

	// Prepare a logger
	const logger = new Logger(logLevel);

	const throwError: ThrowError = ex => {
		// Report the Error
		reportError(reporting, ex, ex.node);
		error = ex;
		return error;
	};

	// Prepare the initial environment
	const environment = createLexicalEnvironment({
		inputEnvironment: {
			preset,
			extra
		},
		startingNode: node,
		policy
	});

	// Prepare a Stack
	const stack: Stack = createStack();

	const statementTraversalStack = createStatementTraversalStack();

	const nodeEvaluatorOptions: ICreateNodeEvaluatorOptions = {
		policy,
		typeChecker,
		typescript,
		logger,
		stack,
		moduleOverrides,
		reporting,
		throwError,
		environment,
		statementTraversalStack,
		getCurrentError: () => error
	};

	// Prepare a NodeEvaluator
	const nodeEvaluator = createNodeEvaluator(nodeEvaluatorOptions);

	try {
		let value: Literal;
		if (isExpression(node, typescript)) {
			value = nodeEvaluator.expression(node, nodeEvaluatorOptions);
		} else if (isStatement(node, typescript)) {
			nodeEvaluator.statement(node, nodeEvaluatorOptions);
			value = stack.pop();
		} else if (isDeclaration(node, typescript)) {
			nodeEvaluator.declaration(node, nodeEvaluatorOptions);
			value = stack.pop();
		}

		// Otherwise, produce an UnexpectedNodeError
		else {
			throwError(new UnexpectedNodeError({node, environment, typescript}));
		}

		if (error != null) {
			return {
				success: false,
				reason: error
			};
		} else {
			// Log the value before returning
			logger.logResult(value);

			return {
				success: true,
				value
			};
		}
	} catch (reason) {
		throwError(reason as EvaluationError);

		return {
			success: false,
			reason: reason as EvaluationError
		};
	}
}
