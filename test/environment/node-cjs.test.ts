import test from "ava";
import path from "crosspath";
import {executeProgram} from "../setup/execute-program.js";
import {withTypeScript} from "../setup/ts-macro.js";

test("Can handle the '__dirname' and '__filename' meta properties in a CommonJS-based Node environment. #1", withTypeScript, (t, {typescript}) => {
	const {result, setup} = executeProgram(
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
			cwd: "/Users/someone/development/foo",
			typescript,
			environment: {
				preset: "NODE"
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {dirname: path.native.join(setup.fileStructure.dir.src), filename: path.native.join(setup.fileStructure.dir.src, "bar.ts")});
	}
});

test("Can handle the '__dirname' and '__filename' meta properties in a CommonJS-based Node environment. #2", withTypeScript, (t, {typescript}) => {
	const {result, setup} = executeProgram(
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
			cwd: "/Users/someone/development/foo",
			typescript,
			environment: {
				preset: "NODE_CJS"
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {dirname: path.native.join(setup.fileStructure.dir.src), filename: path.native.join(setup.fileStructure.dir.src, "bar.ts")});
	}
});

test("Can handle 'process.cwd()' in a CommonJS-based Node environment. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				return process.cwd();
			})();
		`,
		"(() =>",
		{typescript}
	);

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, process.cwd());
	}
});
