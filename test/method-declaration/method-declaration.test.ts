import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can evaluate and retrieve a MethodDeclaration. #1", (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			class Foo {
				add (a: number, b: number): number {
					return a + b;
				}
			}
		`,
		"add (",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});
