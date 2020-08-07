import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {lt} from "semver";

test("Can evaluate and retrieve a PropertyDeclaration. #1", (t, {typescript}) => {
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

test("Can evaluate and retrieve a private PropertyDeclaration. #1", (t, {typescript}) => {
	if (lt(typescript.version, "3.8.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support private class fields. Skipping...`);
		return;
	}

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
