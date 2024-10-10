import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Supports nullish coalescing with null-like values. #1", ">=3.7", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = "";
			const bar = foo ?? "bar";
		`,
		`foo ?? "bar"`,
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, "");
	}
});
