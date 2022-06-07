import {ICreateNodeEvaluatorOptions} from "./i-create-node-evaluator-options.js";
import {NodeEvaluator, NodeWithValue} from "./node-evaluator.js";
import {MaxOpsExceededError} from "../../error/policy-error/max-ops-exceeded-error/max-ops-exceeded-error.js";
import {LexicalEnvironment, pathInLexicalEnvironmentEquals} from "../../lexical-environment/lexical-environment.js";
import {evaluateStatement} from "../evaluate-statement.js";
import {Literal} from "../../literal/literal.js";
import {evaluateExpression} from "../evaluate-expression.js";
import {EvaluatorOptions} from "../evaluator-options.js";
import {evaluateDeclaration} from "../evaluate-declaration.js";
import {evaluateNodeWithArgument} from "../evaluate-node-with-argument.js";
import {evaluateNodeWithValue} from "../evaluate-node-with-value.js";
import {createStatementTraversalStack, StatementTraversalStack} from "../../stack/traversal-stack/statement-traversal-stack.js";
import {reportError} from "../../util/reporting/report-error.js";
import {TRY_SYMBOL} from "../../util/try/try-symbol.js";
import {TS} from "../../../type/ts.js";

/**
 * Creates a Node Evaluator
 */
export function createNodeEvaluator({typeChecker, typescript, policy, logger, stack, reporting, nextNode}: ICreateNodeEvaluatorOptions): NodeEvaluator {
	let ops = 0;

	const handleNewNode = (node: TS.Node, statementTraversalStack: StatementTraversalStack) => {
		nextNode(node);

		// Increment the amount of encountered ops
		ops++;

		// Throw an error if the maximum amount of operations has been exceeded
		if (ops >= policy.maxOps) {
			throw new MaxOpsExceededError({ops, node});
		}

		// Update the statementTraversalStack with the node's kind
		statementTraversalStack.push(node.kind);
		if (reporting.reportTraversal != null) {
			reporting.reportTraversal({node});
		}
	};

	/**
	 * Wraps an evaluation action with error reporting
	 */
	const wrapWithErrorReporting = (environment: LexicalEnvironment, node: TS.Node, action: CallableFunction) => {
		// If we're already inside of a try-block, simply execute the action and do nothing else
		if (pathInLexicalEnvironmentEquals(node, environment, true, TRY_SYMBOL)) {
			return action();
		}

		try {
			return action();
		} catch (ex) {
			// Report the Error
			reportError(reporting, ex as Error, node);

			// Re-throw the error
			throw ex;
		}
	};

	const nodeEvaluator: NodeEvaluator = {
		expression: (node: TS.Expression | TS.PrivateIdentifier, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Literal =>
			wrapWithErrorReporting(environment, node, () => {
				handleNewNode(node, statementTraversalStack);
				return evaluateExpression(getEvaluatorOptions(node, environment, statementTraversalStack));
			}),
		statement: (node: TS.Statement, environment: LexicalEnvironment): void =>
			wrapWithErrorReporting(environment, node, () => {
				const statementTraversalStack = createStatementTraversalStack();
				handleNewNode(node, statementTraversalStack);
				return evaluateStatement(getEvaluatorOptions(node, environment, statementTraversalStack));
			}),
		declaration: (node: TS.Declaration, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): void =>
			wrapWithErrorReporting(environment, node, () => {
				handleNewNode(node, statementTraversalStack);
				return evaluateDeclaration(getEvaluatorOptions(node, environment, statementTraversalStack));
			}),
		nodeWithArgument: (node: TS.Node, environment: LexicalEnvironment, arg: Literal, statementTraversalStack: StatementTraversalStack): void =>
			wrapWithErrorReporting(environment, node, () => {
				handleNewNode(node, statementTraversalStack);
				return evaluateNodeWithArgument(getEvaluatorOptions(node, environment, statementTraversalStack), arg);
			}),
		nodeWithValue: (node: NodeWithValue, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Literal =>
			wrapWithErrorReporting(environment, node, () => {
				handleNewNode(node, statementTraversalStack);
				return evaluateNodeWithValue(getEvaluatorOptions(node, environment, statementTraversalStack));
			})
	};

	/**
	 * Gets an IEvaluatorOptions object ready for passing to one of the evaluation functions
	 */
	function getEvaluatorOptions<T extends TS.Node>(node: T, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): EvaluatorOptions<T> {
		return {
			typeChecker,
			typescript,
			policy,
			reporting,
			node,
			evaluate: nodeEvaluator,
			environment,
			stack,
			logger,
			statementTraversalStack
		};
	}

	return nodeEvaluator;
}
