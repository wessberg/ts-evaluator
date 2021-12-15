import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can capture errors that would otherwise throw with try-catch. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let myVar: string|symbol = Symbol("foo");
				try {
					myVar++;
				} catch (ex) {
					myVar = ex;
				}
				return myVar;
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.true(result.value instanceof Error);
});
