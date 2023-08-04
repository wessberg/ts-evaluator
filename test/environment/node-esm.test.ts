import {test} from "../setup/test-runner.js";
import path from "crosspath";
import {executeProgram} from "../setup/execute-program.js";

test("Can handle the import.meta.url meta property in an ESM-based Node environment. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else {
		t.deepEqual(result.value, {filename: `file://${path.join(setup.fileStructure.dir.src, "bar.ts")}`});
	}
});
