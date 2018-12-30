import {test} from "ava";
import {prepareTest} from "../setup";

test("Can evaluate and retrieve a MethodDeclaration. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			class Foo {
				add (a: number, b: number): number {
					return a + b;
				}
			}
		`,
		"add ("
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});