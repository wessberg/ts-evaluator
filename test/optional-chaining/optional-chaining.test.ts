import test from "ava";
import {prepareTest} from "../setup";

test("Supports optional CallExpressions. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			const foo = {bar: {baz: undefined}};
			const bar = foo.bar.baz?.();
		`,
		"foo.bar.baz?.()"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional PropertyAccessExpressions. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.baz;
		`,
		"foo.bar?.baz"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional ElementAccessExpressions. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.["baz"];
		`,
		`foo.bar?.["baz"]`
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});