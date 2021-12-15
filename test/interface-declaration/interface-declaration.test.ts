import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Understands InterfaceDeclarations. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {foo: "hello world"});
	}
});
