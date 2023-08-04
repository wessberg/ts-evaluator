import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Understands InterfaceDeclarations. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {foo: "hello world"});
	}
});
