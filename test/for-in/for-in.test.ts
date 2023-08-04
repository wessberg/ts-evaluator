import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression with a ForInStatement. #1", "*", (t, {typescript, useTypeChecker}) => {
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
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, "abc");
});
