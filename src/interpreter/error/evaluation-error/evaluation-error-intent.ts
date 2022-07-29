import {TS} from "../../../type/ts.js";
import {NextEvaluatorOptions} from "../../evaluator/evaluator-options.js";
import {EvaluationError} from "./evaluation-error.js";

type EvaluationErrorIntentCallback<T extends EvaluationError> = (node: TS.Node, options: NextEvaluatorOptions) => T;

export class EvaluationErrorIntent<T extends EvaluationError = EvaluationError> {
	constructor(private readonly intent: EvaluationErrorIntentCallback<T>) {}
	construct(node: TS.Node, options: NextEvaluatorOptions): T {
		return this.intent(node, options);
	}
}

export function isEvaluationErrorIntent<T extends EvaluationError = EvaluationError>(item: unknown): item is EvaluationErrorIntent<T> {
	return typeof item === "object" && item != null && item instanceof EvaluationErrorIntent;
}

export function maybeThrow<Value>(node: TS.Node, options: NextEvaluatorOptions, value: Value | EvaluationErrorIntent): Value | EvaluationError {
	return isEvaluationErrorIntent(value) ? options.throwError(value.construct(node, options)) : value;
}
