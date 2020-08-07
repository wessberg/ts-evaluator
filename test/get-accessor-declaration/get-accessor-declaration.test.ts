import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate and retrieve a GetAccessorDeclaration. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
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

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, 2);
	}
});
