import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle Spread assignments to objects. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value as {a: number; b: number; c: number}, {a: 1, b: 2, c: 3});
});
