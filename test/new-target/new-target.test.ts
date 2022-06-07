import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle new.target syntax. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, true);
	}
});