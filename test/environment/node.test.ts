import test from "../util/test-runner";
import {prepareTest} from "../setup";
import {EnvironmentPresetKind} from "../../src/interpreter/environment/environment-preset-kind";
import {normalize} from "path";

test("Can handle the '__dirname' and '__filename' meta properties in a Node environment. #1", (t, {typescript}) => {
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
				preset: EnvironmentPresetKind.NODE
			}
		}
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {dirname: "/Users/someone/development/foo", filename: "/Users/someone/development/foo/bar.ts"});
	}
});

test("Can handle 'process.cwd()' in a Node environment. #1", (t, {typescript}) => {
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
