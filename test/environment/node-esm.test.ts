import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import path from "crosspath";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle the import.meta.url meta property in an ESM-based Node environment. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result, setup} = executeProgram(
		// language=TypeScript
		{
			text: `
				(() => {
					return {filename: import.meta.url};
				})();`,
			fileName: "bar.ts"
		},
		"(() =>",
		{
			cwd: "/Users/someone/development/foo",
			typescript,
			useTypeChecker,
			environment: {
				preset: "NODE_ESM"
			}
		}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else {
		assert.deepEqual(result.value, {filename: `file://${path.join(setup.fileStructure.dir.src, "bar.ts")}`});
	}
});
