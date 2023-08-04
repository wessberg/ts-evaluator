import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Understands TypeAliasDeclarations. #1", "*", (t, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				type HelloWorld = "hello world";
				let a: HelloWorld;
				a = "hello world";
				return a;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "hello world");
	}
});
