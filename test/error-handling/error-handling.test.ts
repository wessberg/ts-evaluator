import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Errors will be caught and set as the 'reason' property on returned values. #1", "*", (t, {typescript, useTypeChecker}) => {
	t.notThrows(() =>
		executeProgram(
			// language=TypeScript
			`
			const foo = require("./somethingthatdoesnotexist.js");
		`,
			"foo",
			{typescript, useTypeChecker}
		)
	);
});
