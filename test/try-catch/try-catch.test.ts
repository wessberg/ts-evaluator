import {test} from "../setup/test-runner.js";
import {executeProgram} from "../setup/execute-program.js";

test("Can capture errors that would otherwise throw with try-catch. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	if (!result.success) t.fail(result.reason.stack);
	else t.true(result.value instanceof Error);
});

test("Will execute the 'finally' branch correctly. #1", "*", (t, {typescript, useTypeChecker}) => {
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

	t.true(executedFinally);
});

test("Will execute the 'finally' branch correctly. #2", "*", (t, {typescript, useTypeChecker}) => {
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

	t.true(executedFinally);
});

test("Will execute the 'finally' branch correctly. #3", "*", (t, {typescript, useTypeChecker}) => {
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

	t.true(executedFinally);
});
