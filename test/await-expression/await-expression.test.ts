import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate an AwaitExpression #1", withTypeScript, async (t, {typescript}) => {
	const {result} = executeProgram(
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

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(await result.value, 1000);
});
