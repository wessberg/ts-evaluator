import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ClassExpressions. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => class {
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert(typeof result.value === "function");
	}
});

test("Can handle ClassExpressions that extends from other named classes. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class A {
			}

			(() => [A, class extends A {}])();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) assert.fail();
	else {
		const [A, B] = result.value;
		assert(Object.getPrototypeOf(B) === A);
	}
});
