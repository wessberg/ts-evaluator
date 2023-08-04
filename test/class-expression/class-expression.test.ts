import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle ClassExpressions. #1", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => class {
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});

test("Can handle ClassExpressions that extends from other named classes. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) t.fail();
	else {
		const [A, B] = result.value;
		t.true(Object.getPrototypeOf(B) === A);
	}
});
