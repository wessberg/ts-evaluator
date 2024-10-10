import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate an AwaitExpression #1", "*", async (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		`
			async function myAsyncFunction (): Promise<number> {
				return new Promise(resolve => setTimeout(() => resolve(1000), 1));
			}

			(async () => {
				return await myAsyncFunction();
			})();
		`,
		"return await myAsyncFunction()",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(await result.value, 1000);
});
