import test from "ava";
import {prepareTest} from "../setup";
import {withTypeScript} from "../util/ts-macro";

test("Can evaluate an AwaitExpression #1", withTypeScript, async (t, {typescript}) => {
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
