import {Declaration, Expression, Node, Statement} from "typescript";
import {ICreateNodeEvaluatorOptions} from "./i-create-node-evaluator-options";
import {NodeEvaluator, NodeWithValue} from "./node-evaluator";
import {MaxOpsExceededError} from "../../error/policy-error/max-ops-exceeded-error/max-ops-exceeded-error";
import {LexicalEnvironment} from "../../lexical-environment/lexical-environment";
import {evaluateStatement} from "../evaluate-statement";
import {Literal} from "../../literal/literal";
import {evaluateExpression} from "../evaluate-expression";
import {IEvaluatorOptions} from "../i-evaluator-options";
import {evaluateDeclaration} from "../evaluate-declaration";
import {evaluateNodeWithArgument} from "../evaluate-node-with-argument";
import {evaluateNodeWithValue} from "../evaluate-node-with-value";
import {createStatementTraversalStack, StatementTraversalStack} from "../../stack/traversal-stack/statement-traversal-stack";

/**
 * Creates a Node Evaluator
 * @param {ICreateNodeEvaluatorOptions} options
 * @returns {NodeEvaluator}
 */
export function createNodeEvaluator ({typeChecker, policy, logger, stack, reporting}: ICreateNodeEvaluatorOptions): NodeEvaluator {
	let ops = 0;

	const handleNewNode = (node: Node, statementTraversalStack: StatementTraversalStack) => {

		// Increment the amount of encountered ops
		ops++;

		// Throw an error if the maximum amount of operations has been exceeded
		if (ops >= policy.maxOps) {
			throw new MaxOpsExceededError({ops});
		}

		// Update the statementTraversalStack with the node's kind
		statementTraversalStack.push(node.kind);
		if (reporting.reportTraversal != null) {
			reporting.reportTraversal({node});
		}
	};

	const nodeEvaluator: NodeEvaluator = {
		expression: (node: Expression, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Literal => {
			handleNewNode(node, statementTraversalStack);
			return evaluateExpression(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		statement: (node: Statement, environment: LexicalEnvironment): void => {
			const statementTraversalStack = createStatementTraversalStack();
			handleNewNode(node, statementTraversalStack);
			return evaluateStatement(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		declaration: (node: Declaration, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): void => {
			handleNewNode(node, statementTraversalStack);
			return evaluateDeclaration(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		nodeWithArgument: (node: Node, environment: LexicalEnvironment, arg: Literal, statementTraversalStack: StatementTraversalStack): void => {
			handleNewNode(node, statementTraversalStack);
			return evaluateNodeWithArgument(getEvaluatorOptions(node, environment, statementTraversalStack), arg);
		},
		nodeWithValue: (node: NodeWithValue, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Literal => {
			handleNewNode(node, statementTraversalStack);
			return evaluateNodeWithValue(getEvaluatorOptions(node, environment, statementTraversalStack));
		}
	};

	/**
	 * Gets an IEvaluatorOptions object ready for passing to one of the evaluation functions
	 * @param {T} node
	 * @param {LexicalEnvironment} environment
	 * @param {StatementTraversalStack} statementTraversalStack
	 * @return {IEvaluatorOptions<T>}
	 */
	function getEvaluatorOptions<T extends Node> (node: T, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): IEvaluatorOptions<T> {
		return {
			typeChecker,
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