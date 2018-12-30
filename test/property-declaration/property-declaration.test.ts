import test from "ava";
import {prepareTest} from "../setup";

test("Can evaluate and retrieve a PropertyDeclaration. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			class Foo {
				private someInstanceProp = 2;
			}
		`,
		"someInstanceProp"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});