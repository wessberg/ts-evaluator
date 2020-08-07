import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {lt} from "semver";

test("Supports nullish coalescing with null-like values. #1", (t, {typescript}) => {
	if (lt(typescript.version, "3.7.0")) {
		t.pass(`Current TypeScript version (${typescript.version} does not support '??' syntax. Skipping...`);
		return;
	}

	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			const foo = "";
			const bar = foo ?? "bar";
		`,
		`foo ?? "bar"`,
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, "");
	}
});
