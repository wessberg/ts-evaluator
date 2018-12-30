import {test} from "ava";
import {prepareTest} from "../setup";
import {EnvironmentPresetKind} from "../../src/interpreter/environment/environment-preset-kind";

test("Can handle the '__dirname' and '__filename' meta properties in a Node environment. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
		{
			text: `
				(() => {
					return {dirname: __dirname, filename: __filename};
				})();`,
			fileName: "/Users/someone/development/foo/bar.ts"
		},
		"(() =>",
		{
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

test("Can handle 'process.cwd()' in a Node environment. #1", t => {
	const {evaluate} = prepareTest(
		// language=TypeScript
			`
			(() => {
				return process.cwd();
			})();
		`,
		"(() =>"
	);

	const result = evaluate();

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, process.cwd());
	}
});