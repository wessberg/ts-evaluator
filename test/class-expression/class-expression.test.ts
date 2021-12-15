import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can handle ClassExpressions. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => class {
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});

test("Can handle ClassExpressions that extends from other named classes. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class A {
			}

			(() => [A, class extends A {}])();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) t.fail();
	else {
		const [A, B] = result.value;
		t.true(Object.getPrototypeOf(B) === A);
	}
});
