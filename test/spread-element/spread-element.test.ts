import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can handle Spread Elements in arrays. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value as number[], [1, 2, 3]);
});

test("Can handle Spread Elements in CallExpressions. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value as string, "FOO-4");
});
