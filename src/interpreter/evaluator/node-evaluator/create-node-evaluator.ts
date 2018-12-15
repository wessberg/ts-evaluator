import {Declaration, Expression, Node, Statement} from "typescript";
import {ICreateNodeEvaluatorOptions} from "./i-create-node-evaluator-options";
import {NodeEvaluator, NodeWithValue} from "./node-evaluator";
import {MaxOpsExceededError} from "../../error/policy-error/max-ops-exceeded-error/max-ops-exceeded-error";
import {LexicalEnvironment, setLexicalEnvironmentForNode} from "../../lexical-environment/lexical-environment";
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
export function createNodeEvaluator ({typeChecker, policy, logger, stack}: ICreateNodeEvaluatorOptions): NodeEvaluator {
	let ops = 0;

	const handleNewNode = (node: Node, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => {

		// Increment the amount of encountered ops
		ops++;

		// Throw an error if the maximum amount of operations has been exceeded
		if (ops >= policy.maxOps) {
			throw new MaxOpsExceededError({ops});
		}

		// Set the lexical environment for that Node
		setLexicalEnvironmentForNode(node, environment);

		// Update the statementTraversalStack with the node's kind
		statementTraversalStack.push(node.kind);
	};

	const nodeEvaluator: NodeEvaluator = {
		expression: (node: Expression, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Promise<Literal> => {
			handleNewNode(node, environment, statementTraversalStack);
			return evaluateExpression(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		statement: (node: Statement, environment: LexicalEnvironment): Promise<void> => {
			const statementTraversalStack = createStatementTraversalStack();
			handleNewNode(node, environment, statementTraversalStack);
			return evaluateStatement(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		declaration: (node: Declaration, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Promise<void> => {
			handleNewNode(node, environment, statementTraversalStack);
			return evaluateDeclaration(getEvaluatorOptions(node, environment, statementTraversalStack));
		},
		nodeWithArgument: (node: Node, environment: LexicalEnvironment, arg: Literal, statementTraversalStack: StatementTraversalStack): Promise<void> => {
			handleNewNode(node, environment, statementTraversalStack);
			return evaluateNodeWithArgument(getEvaluatorOptions(node, environment, statementTraversalStack), arg);
		},
		nodeWithValue: (node: NodeWithValue, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack): Promise<Literal> => {
			handleNewNode(node, environment, statementTraversalStack);
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