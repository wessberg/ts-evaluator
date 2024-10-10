import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle new.target syntax. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		`
		let result: boolean|undefined;
		function Foo() {
			if (!new.target) result = false;
			else result = true;
		}
		(() => {
			new Foo();
			return result;
		})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, true);
	}
});
