import test from "ava";
import {prepareTest} from "../setup";

test("Can evaluate and retrieve a GetAccessorDeclaration. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			class Foo {
				get something () {
					return 2;
				}
			}
		`,
		"get"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});