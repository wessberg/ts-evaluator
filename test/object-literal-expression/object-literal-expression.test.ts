import {test} from "ava";
import {prepareTest} from "../setup";

test("Can handle ObjectLiteralExpressions. #1", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			({
				foo: "foo",
				get bar () {
					return this.foo;
				}
			})
		`,
		"({"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as { readonly bar: string }).bar, "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #2", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			({
				foo: "foo",
				bar () {
					return this.foo;
				}
			})
		`,
		"({"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as { bar (): string }).bar(), "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #3", t => {
	// noinspection BadExpressionStatementJS
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			const baz = "someKey";
			({
				foo: {
					bar: {
						[baz]: 2
					}
				}
			})
		`,
		"({"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as { foo: { bar: { someKey: number } } }).foo.bar.someKey, 2);
	}
});