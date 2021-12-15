import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate a CallExpression with a ForInStatement. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			function myFunc (): string {
				let str = "";
				let obj = {a: "", b: "", c: ""};
				for (const foo in obj) {
					str += foo;
				}
				return str;
			}

			myFunc();
		`,
		"myFunc(",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "abc");
});
