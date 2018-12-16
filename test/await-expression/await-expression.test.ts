import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate an AwaitExpression #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			async function myAsyncFunction (): Promise<number> {
				return new Promise(resolve => setTimeout(() => resolve(1000), 1000));
			}

			(async () => {
				return await myAsyncFunction();
			})();
		`,
		"return await myAsyncFunction()"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, 1000);
});