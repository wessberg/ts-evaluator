import type {ICreateNodeEvaluatorOptions} from "./i-create-node-evaluator-options.js";
import type {NodeEvaluator} from "./node-evaluator.js";
import {MaxOpsExceededError} from "../../error/policy-error/max-ops-exceeded-error/max-ops-exceeded-error.js";
import {evaluateStatement} from "../evaluate-statement.js";
import {evaluateExpression} from "../evaluate-expression.js";
import type {EvaluatorOptions, NextEvaluatorOptions} from "../evaluator-options.js";
import {evaluateDeclaration} from "../evaluate-declaration.js";
import {evaluateNodeWithArgument} from "../evaluate-node-with-argument.js";
import {evaluateNodeWithValue} from "../evaluate-node-with-value.js";
import {createStatementTraversalStack} from "../../stack/traversal-stack/statement-traversal-stack.js";
import type {TS} from "../../../type/ts.js";
import type {EvaluationError} from "../../error/evaluation-error/evaluation-error.js";
import {isEvaluationError} from "../../error/evaluation-error/evaluation-error.js";
import type {Literal} from "../../literal/literal.js";

/**
 * Creates a Node Evaluator
 */
export function createNodeEvaluator(options: ICreateNodeEvaluatorOptions): NodeEvaluator {
	let ops = 0;

	const {policy, reporting} = options;

	const prequalifyNextNode = (node: TS.Node, nextOptions: NextEvaluatorOptions): EvaluationError | undefined => {
		const {
			environment = options.environment,
			statementTraversalStack = options.statementTraversalStack,
			getCurrentError = options.getCurrentError,
			throwError = options.throwError
		} = nextOptions ?? {};
		const currentError = getCurrentError();
		if (currentError != null) {
			return currentError;
		}

		// Increment the amount of encountered ops
		ops++;

		// Throw an error if the maximum amount of operations has been exceeded
		if (ops >= policy.maxOps) {
			return throwError(new MaxOpsExceededError({ops, environment, node}));
		}

		// Update the statementTraversalStack with the node's kind
		statementTraversalStack.push(node.kind);
		if (reporting.reportTraversal != null) {
			reporting.reportTraversal({node});
		}
		return undefined;
	};

	const evaluate: NodeEvaluator = {
		statement: (node, nextOptions): void => {
			const combinedNextOptions = {...nextOptions, statementTraversalStack: createStatementTraversalStack()};
			const prequalifyResult = prequalifyNextNode(node, combinedNextOptions);
			if (isEvaluationError(prequalifyResult)) {
				return;
			}
			return evaluateStatement(getEvaluatorOptions(node, combinedNextOptions));
		},
		declaration: (node, nextOptions): void => {
			const prequalifyResult = prequalifyNextNode(node, nextOptions);
			if (isEvaluationError(prequalifyResult)) {
				return;
			}
			return evaluateDeclaration(getEvaluatorOptions(node, nextOptions));
		},
		nodeWithArgument: (node, arg, nextOptions): void => {
			const prequalifyResult = prequalifyNextNode(node, nextOptions);
			if (isEvaluationError(prequalifyResult)) {
				return;
			}
			return evaluateNodeWithArgument(getEvaluatorOptions(node, nextOptions), arg);
		},
		expression: (node, nextOptions): Literal | EvaluationError => {
			const prequalifyResult = prequalifyNextNode(node, nextOptions);
			if (isEvaluationError(prequalifyResult)) {
				return prequalifyResult;
			}
			return evaluateExpression(getEvaluatorOptions(node, nextOptions));
		},
		nodeWithValue: (node, nextOptions): Literal | EvaluationError => {
			const prequalifyResult = prequalifyNextNode(node, nextOptions);
			if (isEvaluationError(prequalifyResult)) {
				return prequalifyResult;
			}
			return evaluateNodeWithValue(getEvaluatorOptions(node, nextOptions));
		}
	};

	/**
	 * Gets an IEvaluatorOptions object ready for passing to one of the evaluation functions
	 */
	function getEvaluatorOptions<T extends TS.Node>(node: T, nextOptions: NextEvaluatorOptions): EvaluatorOptions<T> {
		return {
			...options,
			...nextOptions,
			evaluate,
			node
		};
	}

	return evaluate;
}
