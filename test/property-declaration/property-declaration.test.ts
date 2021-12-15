import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript, withTypeScriptVersions} from "../setup/ts-macro";

test("Can evaluate and retrieve a PropertyDeclaration. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				private someInstanceProp = 2;
			}
		`,
		"someInstanceProp",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});

test("Can evaluate and retrieve a private PropertyDeclaration. #1", withTypeScriptVersions(">=3.8"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			class Foo {
				#someInstanceProp = 2;
			}
		`,
		"#someInstanceProp",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});
