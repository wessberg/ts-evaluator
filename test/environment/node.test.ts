import test from "ava";
import {prepareTest} from "../setup";
import {withTypeScript} from "../util/ts-macro";
import {normalize} from "path";

test("Can handle the '__dirname' and '__filename' meta properties in a Node environment. #1", withTypeScript, (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		{
			text: `
				(() => {
					return {dirname: __dirname, filename: __filename};
				})();`,
			fileName: "bar.ts"
		},
		"(() =>",
		{
			cwd: normalize("/Users/someone/development/foo"),
			typescript,
			environment: {
				preset: "NODE"
			}
		}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {dirname: "/Users/someone/development/foo", filename: "/Users/someone/development/foo/bar.ts"});
	}
});

test("Can handle 'process.cwd()' in a Node environment. #1", withTypeScript, (t, {typescript}) => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		`
			(() => {
				return process.cwd();
			})();
		`,
		"(() =>",
		{typescript}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, process.cwd());
	}
});
