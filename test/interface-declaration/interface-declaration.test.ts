import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Understands InterfaceDeclarations. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				interface HelloWorld {
					foo: string;
				}
				const a: HelloWorld = {foo: "hello world"};
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, {foo: "hello world"});
	}
});
