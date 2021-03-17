import test from "ava";
import {prepareTest} from "../setup";
import {withTypeScript, withTypeScriptVersions} from "../util/ts-macro";

test("Can evaluate and retrieve a PropertyDeclaration. #1", withTypeScript, (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			class Foo {
				private someInstanceProp = 2;
			}
		`,
		"someInstanceProp",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});

test("Can evaluate and retrieve a private PropertyDeclaration. #1", withTypeScriptVersions(">=3.8"), (t, {typescript}) => {

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			class Foo {
				#someInstanceProp = 2;
			}
		`,
		"#someInstanceProp",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});
