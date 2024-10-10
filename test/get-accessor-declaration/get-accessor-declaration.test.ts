import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate and retrieve a GetAccessorDeclaration. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				get something () {
					return 2;
				}
			}
		`,
		"get",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 2);
	}
});
