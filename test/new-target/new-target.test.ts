import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle new.target syntax. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, true);
	}
});
