import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";

test("Can evaluate and retrieve a GetAccessorDeclaration. #1", withTypeScript, (t, {typescript}) => {
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
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});
