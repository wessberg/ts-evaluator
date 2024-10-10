import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can evaluate and retrieve a PropertyDeclaration. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				private someInstanceProp = 2;
			}
		`,
		"someInstanceProp",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 2);
	}
});

test("Can evaluate and retrieve a private PropertyDeclaration. #1", ">=3.8", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		`
			class Foo {
				#someInstanceProp = 2;
			}
		`,
		"#someInstanceProp",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, 2);
	}
});
