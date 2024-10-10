import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle Spread Elements in arrays. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const a = [1, 2];
				const b = [...a, 3];
				return b;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value as number[], [1, 2, 3]);
});

test("Can handle Spread Elements in CallExpressions. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				function foo (...args: [number, number, string]): string {
					const [first, second, third] = args;
					return (third.toUpperCase() + "-" + (first ** second));
				}

				return foo(2, 2, "foo")
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value as string, "FOO-4");
});
