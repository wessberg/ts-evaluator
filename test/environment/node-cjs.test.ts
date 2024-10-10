import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import path from "crosspath";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle the '__dirname' and '__filename' meta properties in a CommonJS-based Node environment. #1", "*", (_, {typescript, useTypeChecker}) => {
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
			useTypeChecker,
			environment: {
				preset: "NODE"
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, {dirname: path.native.join(setup.fileStructure.dir.src), filename: path.native.join(setup.fileStructure.dir.src, "bar.ts")});
	}
});

test("Can handle the '__dirname' and '__filename' meta properties in a CommonJS-based Node environment. #2", "*", (_, {typescript, useTypeChecker}) => {
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
			useTypeChecker,
			environment: {
				preset: "NODE_CJS"
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, {dirname: path.native.join(setup.fileStructure.dir.src), filename: path.native.join(setup.fileStructure.dir.src, "bar.ts")});
	}
});

test("Can handle 'process.cwd()' in a CommonJS-based Node environment. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				return process.cwd();
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, process.cwd());
	}
});
