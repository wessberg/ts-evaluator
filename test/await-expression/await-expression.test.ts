import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate an AwaitExpression #1", async (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			async function myAsyncFunction (): Promise<number> {
				return new Promise(resolve => setTimeout(() => resolve(1000), 1));
			}

			(async () => {
				return await myAsyncFunction();
			})();
		`,
		"return await myAsyncFunction()",
		{typescript}
	);

	const result = evaluate();
	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(await result.value, 1000);
});
