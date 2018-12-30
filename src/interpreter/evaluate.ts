import {IEvaluateOptions} from "./i-evaluate-options";
import {createLexicalEnvironment} from "./lexical-environment/lexical-environment";
import {EvaluateResult} from "./evaluate-result";
import {evaluateSimpleLiteral} from "./evaluator/simple/evaluate-simple-literal";
import {createNodeEvaluator} from "./evaluator/node-evaluator/create-node-evaluator";
import {LogLevelKind} from "./logger/log-level";
import {Logger} from "./logger/logger";
import {createStatementTraversalStack} from "./stack/traversal-stack/statement-traversal-stack";
import {isExpression} from "./util/expression/is-expression";
import {Literal} from "./literal/literal";
import {isStatement} from "./util/statement/is-statement";
import {createStack, Stack} from "./stack/stack";
import {isDeclaration} from "./util/declaration/is-declaration";
import {UnexpectedNodeError} from "./error/unexpected-node-error/unexpected-node-error";
import {IEvaluatePolicySanitized} from "./policy/i-evaluate-policy";
import {EnvironmentPresetKind} from "./environment/environment-preset-kind";
import {Node} from "typescript";
import {EvaluationError} from "./error/evaluation-error/evaluation-error";
import {ThrownError} from "./error/thrown-error/thrown-error";

/**
 * Will get a literal value for the given Expression, ExpressionStatement, or Declaration.
 * @param {IEvaluateOptions} options
 * @returns {Promise<EvaluateResult>}
 */
export function evaluate ({
														typeChecker,
														node,
														environment: {
															preset = EnvironmentPresetKind.NODE,
															extra = {}
														} = {},
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
														reporting = {}
													}: IEvaluateOptions): EvaluateResult {
	// Take the simple path first. This may be far more performant than building up an environment
	const simpleLiteralResult = evaluateSimpleLiteral(node);
	if (simpleLiteralResult.success) return simpleLiteralResult;

	// Otherwise, build an environment and get to work
	// Sanitize the evaluation policy based on the input options
	const policy: IEvaluatePolicySanitized = {
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

	// Prepare a reference to the Node that is currently being evaluated
	let currentNode: Node = node;

	// Prepare a logger
	const logger = new Logger(logLevel);

	// Prepare the initial environment
	const initialEnvironment = createLexicalEnvironment({
		inputEnvironment: {
			preset,
			extra
		},
		policy,
		getCurrentNode: () => currentNode
	});

	// Prepare a Stack
	const stack: Stack = createStack();

	// Prepare a NodeEvaluator
	const nodeEvaluator = createNodeEvaluator({
		policy,
		typeChecker,
		logger,
		stack,
		reporting,
		nextNode: nextNode => currentNode = nextNode
	});

	try {
		let value: Literal;
		if (isExpression(node)) {
			value = nodeEvaluator.expression(node, initialEnvironment, createStatementTraversalStack());
		}

		else if (isStatement(node)) {
			nodeEvaluator.statement(node, initialEnvironment);
			value = stack.pop();
		}

		else if (isDeclaration(node)) {
			nodeEvaluator.declaration(node, initialEnvironment, createStatementTraversalStack());
			value = stack.pop();
		}

		// Otherwise, throw an UnexpectedNodeError
		else {
			// noinspection ExceptionCaughtLocallyJS
			throw new UnexpectedNodeError({node});
		}

		// Log the value before returning
		logger.logResult(value);

		return {
			success: true,
			value
		};
	} catch (reason) {
		// If the Error hasn't been wrapped or wasn't thrown internally, wrap it in a ThrownError
		if (!(reason instanceof EvaluationError)) {
			reason = new ThrownError({originalError: reason, node: currentNode});
		}
		return {
			success: false,
			reason
		};
	}
}