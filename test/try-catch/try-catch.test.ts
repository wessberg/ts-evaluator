import {test} from "../setup/test-runner.js";
import assert from "node:assert";
import {executeProgram} from "../setup/execute-program.js";

test("Can capture errors that would otherwise throw with try-catch. #1", "*", (_, {typescript, useTypeChecker}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				let myVar: string|symbol = Symbol("foo");
				try {
					myVar++;
				} catch (ex) {
					myVar = ex;
				}
				return myVar;
			})();
		`,
		"(() =>",
		{typescript, useTypeChecker}
	);

	if (!result.success) assert.fail(result.reason.stack);
	else assert(result.value instanceof Error);
});

test("Will execute the 'finally' branch correctly. #1", "*", (_, {typescript, useTypeChecker}) => {
	let executedFinally = false;
	executeProgram(
		// language=TypeScript
		`
			(() => {
				let executedFinally = false;
				try {
					throw new Error();
				} finally {
					executedFinally = true;
				}
				return myVar;
			})();
		`,
		"(() =>",
		{
			typescript,
			useTypeChecker,
			reporting: {
				reportBindings: ({path, value}) => {
					if (path === "executedFinally") {
						executedFinally = Boolean(value);
					}
				}
			}
		}
	);

	assert(executedFinally);
});

test("Will execute the 'finally' branch correctly. #2", "*", (_, {typescript, useTypeChecker}) => {
	let executedFinally = false;
	executeProgram(
		// language=TypeScript
		`
			(() => {
				let executedFinally = false;
				try {
					throw new Error();
				} catch (ex) {
					// Noop
				} finally {
					executedFinally = true;
				}
				return myVar;
			})();
		`,
		"(() =>",
		{
			typescript,
			useTypeChecker,
			reporting: {
				reportBindings: ({path, value}) => {
					if (path === "executedFinally") {
						executedFinally = Boolean(value);
					}
				}
			}
		}
	);

	assert(executedFinally);
});

test("Will execute the 'finally' branch correctly. #3", "*", (_, {typescript, useTypeChecker}) => {
	let executedFinally = false;
	executeProgram(
		// language=TypeScript
		`
			(() => {
				let executedFinally = false;
				try {
					throw new Error();
				} catch (ex) {
					throw new Error();
				} finally {
					executedFinally = true;
				}
				return myVar;
			})();
		`,
		"(() =>",
		{
			typescript,
			useTypeChecker,
			reporting: {
				reportBindings: ({path, value}) => {
					if (path === "executedFinally") {
						executedFinally = Boolean(value);
					}
				}
			}
		}
	);

	assert(executedFinally);
});
