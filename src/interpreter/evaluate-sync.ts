import {await} from "deasync2";
import {evaluate} from "./evaluate";
import {IEvaluateOptions} from "./i-evaluate-options";
import {EvaluateResult} from "./evaluate-result";

/**
 * A synchronous version of 'evaluate'
 * @param {IEvaluateOptions} options
 * @return {EvaluateResult}
 */
export function evaluateSync (options: IEvaluateOptions): EvaluateResult {
	return await(evaluate(options));
}