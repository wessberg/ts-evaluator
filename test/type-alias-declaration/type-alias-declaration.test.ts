import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Understands TypeAliasDeclarations. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "hello world");
	}
});
