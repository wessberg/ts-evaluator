import test from "ava";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Errors will be caught and set as the 'reason' property on returned values. #1", withTypeScript, (t, {typescript, useTypeChecker}) => {
	t.notThrows(() => executeProgram(
		// language=TypeScript
		`
			const foo = require("./somethingthatdoesnotexist.js");
		`,
		"foo",
		{typescript, useTypeChecker}
	));
});
