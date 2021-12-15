/* eslint-disable @typescript-eslint/naming-convention */
import test from "ava";
import {executeProgram} from "../setup/execute-program";
import {withTypeScript} from "../setup/ts-macro";
import {IoError} from "../../src/interpreter/error/policy-error/io-error/io-error";
import {NonDeterministicError} from "../../src/interpreter/error/policy-error/non-deterministic-error/non-deterministic-error";
import {NetworkError} from "../../src/interpreter/error/policy-error/network-error/network-error";
import {ProcessError} from "../../src/interpreter/error/policy-error/process-error/process-error";

test("Throws on IO read if the policy requires it. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import {readFileSync} from "fs";
				try {
					readFileSync("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on IO read if the policy requires it. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import * as fs from "fs";
				try {
					fs.readFileSync("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on IO read if the policy requires it. #3", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import * as fs from "fs";
				try {
					const alias = fs;
					alias.readFileSync("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on IO read if the policy requires it. #4", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import * as fs from "fs";
				try {
					const alias = fs.readFileSync;
					alias("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on IO read if the policy requires it. #5", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import fs = require("fs");
				try {
					fs.readFileSync("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on IO read if the policy requires it. #6", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				const {readFileSync} = require("fs");
				try {
					readFileSync("/foo");
					return false;
				} catch (ex) {
					return ex instanceof IoError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				io: {
					read: false,
					write: true
				}
			},
			environment: {
				extra: {
					IoError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on invoking Math.random() read if the policy is non-deterministic. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				try {
					Math.random();
					return false;
				} catch (ex) {
					return ex instanceof NonDeterministicError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				deterministic: true
			},
			environment: {
				extra: {
					NonDeterministicError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Doesn't throws on _getting_ Math.random, even if the policy is non-deterministic. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				try {
					const randomFunction = Math.random;
					return true;
				} catch (ex) {
					return !(ex instanceof NonDeterministicError);
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				deterministic: true
			},
			environment: {
				extra: {
					NonDeterministicError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on constructing new Date() without arguments if the policy is non-deterministic. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				try {
					new Date();
					return false;
				} catch (ex) {
					return ex instanceof NonDeterministicError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				deterministic: true
			},
			environment: {
				extra: {
					NonDeterministicError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Doesn't throws on construction of a new Date with a specific date input, even if the policy is non-deterministic. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				try {
					new Date("01-01-1991");
					return true;
				} catch (ex) {
					if (!(ex instanceof NonDeterministicError)) throw ex;
					return false;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				deterministic: true
			},
			environment: {
				extra: {
					NonDeterministicError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on Network activity if the policy requires it. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import {request} from "http";
				try {
					request("foo");
					return false;
				} catch (ex) {
					return ex instanceof NetworkError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				network: false
			},
			environment: {
				extra: {
					NetworkError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on Network activity if the policy requires it. #2", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import {globalAgent} from "http";
				try {
					globalAgent.destroy();
					return false;
				} catch (ex) {
					return ex instanceof NetworkError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				network: false
			},
			environment: {
				extra: {
					NetworkError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on attempting to exit the Process if the policy requires it. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				try {
					process.exit();
					return false;
				} catch (ex) {
					return ex instanceof ProcessError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				process: false
			},
			environment: {
				preset: "NODE",
				extra: {
					ProcessError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});

test("Throws on attempting to spawn a child process if the policy requires it. #1", withTypeScript, (t, {typescript}) => {
	const {result} = executeProgram(
		// language=TypeScript
		`
			(() => {
				import {spawn} from "child_process";
				try {
					spawn("ls");
					return false;
				} catch (ex) {
					return ex instanceof ProcessError;
				}
			})();
		`,
		"(() => ",
		{
			typescript,
			policy: {
				process: false
			},
			environment: {
				extra: {
					ProcessError
				}
			}
		}
	);

	if (!result.success) t.fail(result.reason.stack);
	else t.deepEqual(result.value, true);
});
