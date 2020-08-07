import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {lt} from "semver";

test("Supports optional CallExpressions. #1", (t, {typescript}) => {
	if (lt(typescript.version, "3.7.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support '?.' syntax. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = {bar: {baz: undefined}};
			const bar = foo.bar.baz?.();
		`,
		"foo.bar.baz?.()",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional PropertyAccessExpressions. #1", (t, {typescript}) => {
	if (lt(typescript.version, "3.7.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support '?.' syntax. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.baz;
		`,
		"foo.bar?.baz",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});

test("Supports optional ElementAccessExpressions. #1", (t, {typescript}) => {
	if (lt(typescript.version, "3.7.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support '?.' syntax. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = {bar: undefined};
			const bar = foo.bar?.["baz"];
		`,
		`foo.bar?.["baz"]`,
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, undefined);
	}
});
