import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Errors will be caught and set as the 'reason' property on returned values. #1", "*", (_, {typescript, useTypeChecker}) => {
	assert.doesNotThrow(() =>
		executeProgram(
			`
			const foo = require("./somethingthatdoesnotexist.js");
		`,
			"foo",
			{typescript, useTypeChecker}
		)
	);
});
