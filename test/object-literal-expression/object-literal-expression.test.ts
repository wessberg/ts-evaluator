import test from "../util/test-runner";
import {prepareTest} from "../setup";

test("Can handle ObjectLiteralExpressions. #1", (t, {typescript}) => {
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
		"({",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {readonly bar: string}).bar, "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #2", (t, {typescript}) => {
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
		"({",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {bar(): string}).bar(), "foo");
	}
});

test("Can handle ObjectLiteralExpressions. #3", (t, {typescript}) => {
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
		"({",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual((result.value as {foo: {bar: {someKey: number}}}).foo.bar.someKey, 2);
	}
});
