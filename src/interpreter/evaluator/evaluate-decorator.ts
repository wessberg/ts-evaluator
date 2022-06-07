import {EvaluatorOptions} from "./evaluator-options.js";
import {IndexLiteral, stringifyLiteral} from "../literal/literal.js";
import {NotCallableError} from "../error/not-callable-error/not-callable-error.js";
import {TS} from "../../type/ts.js";
import {__decorate, __param} from "../util/tslib/tslib-util.js";

/**
 * Evaluates, or attempts to evaluate, a Decorator
 */
export function evaluateDecorator(
	{node, environment, evaluate, stack, statementTraversalStack}: EvaluatorOptions<TS.Decorator>,
	[parent, propertyName, index]: [IndexLiteral, string?, number?]
): void {
	const decoratorImplementation = evaluate.expression(node.expression, environment, statementTraversalStack);

	if (typeof decoratorImplementation !== "function") {
		throw new NotCallableError({
			node,
			value: decoratorImplementation,
			message: `${stringifyLiteral(decoratorImplementation)} is not a valid decorator implementation'`
		});
	}

	stack.push(__decorate([index != null ? __param(index, decoratorImplementation) : decoratorImplementation], parent, propertyName));
}
