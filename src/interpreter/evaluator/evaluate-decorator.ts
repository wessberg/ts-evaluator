import {IEvaluatorOptions} from "./i-evaluator-options";
import {Decorator} from "typescript";
import {IndexLiteral, stringifyLiteral} from "../literal/literal";
import {NotCallableError} from "../error/not-callable-error/not-callable-error";
import {__decorate, __param} from "tslib";

/**
 * Evaluates, or attempts to evaluate, a Decorator
 * @param {IEvaluatorOptions<Decorator>} options
 * @param {*} args
 * @param {IndexLiteral} parent
 * @returns {Promise<void>}
 */
export function evaluateDecorator ({node, environment, evaluate, stack, statementTraversalStack}: IEvaluatorOptions<Decorator>, [parent, propertyName, index]: [IndexLiteral, string?, number?]): void {
	const decoratorImplementation = evaluate.expression(node.expression, environment, statementTraversalStack);

	if (typeof decoratorImplementation !== "function") {
		throw new NotCallableError({node, value: decoratorImplementation, message: `${stringifyLiteral(decoratorImplementation)} is not a valid decorator implementation'`});
	}

	stack.push(
		__decorate([
			index != null
				? __param(index, decoratorImplementation)
				: decoratorImplementation
		], parent, propertyName)
	);
}