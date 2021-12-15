import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScriptVersions} from "../setup/ts-macro";

test("Supports optional CallExpressions. #1", withTypeScriptVersions(">=3.7"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: {baz: undefined}};
			const bar = foo.bar.baz?.();
		`,
		"foo.bar.baz?.()",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional PropertyAccessExpressions. #1", withTypeScriptVersions(">=3.7"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.baz;
		`,
		"foo.bar?.baz",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional ElementAccessExpressions. #1", withTypeScriptVersions(">=3.7"), (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.["baz"];
		`,
		`foo.bar?.["baz"]`,
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});
