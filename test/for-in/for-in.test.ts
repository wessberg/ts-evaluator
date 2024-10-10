import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate a CallExpression with a ForInStatement. #1", "*", (_, {typescript, useTypeChecker}) => {
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

	if (!result.success) assert.fail(result.reason.stack);
	else assert.deepEqual(result.value, "abc");
});
