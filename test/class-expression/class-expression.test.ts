import test from "ava";
import {prepareTest} from "../setup";

test("Can handle ClassExpressions. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => class {
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.true(typeof result.value === "function");
	}
});

test("Can handle ClassExpressions that extends from other named classes. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			class A {
			}

			(() => [A, class extends A {}])();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else if (!Array.isArray(result.value)) t.fail();
	else {
		const [A, B] = result.value;
		t.true(Object.getPrototypeOf(B) === A);
	}
});
