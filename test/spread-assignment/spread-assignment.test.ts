import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle Spread assignments to objects. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const a = {
					a: 1,
					b: 2
				};
				const b = {
					...a,
					c: 3
				}
				return b;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value as {a: number; b: number; c: number}, {a: 1, b: 2, c: 3});
});
