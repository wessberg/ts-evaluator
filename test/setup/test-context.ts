import type {PartialExcept} from "helpertypes";
import type {EvaluateOptions} from "../../src/interpreter/evaluate-options.js";
import {LogLevelKind} from "../../src/interpreter/logger/log-level.js";

const _process = process;
export interface TestContext extends PartialExcept<Required<EvaluateOptions>, "typescript"> {
	cwd: string;
	useTypeChecker: boolean;
}

export function createTestContext({
	typescript,
	environment,
	useTypeChecker = true,
	moduleOverrides = {},
	cwd = _process.cwd(),
	policy: {
		deterministic = true,
		maxOps = Infinity,
		maxOpDuration = Infinity,
		console = false,
		network = false,
		io = {
			read: true,
			write: false
		},
		process = {
			exit: false,
			spawnChild: false
		}
	} = {},
	reporting,
	logLevel = LogLevelKind.SILENT
}: PartialExcept<TestContext, "typescript">): TestContext {
	return {
		cwd,
		typescript,
		environment,
		moduleOverrides,
		reporting,
		useTypeChecker,
		policy: {
			maxOps,
			maxOpDuration,
			deterministic,
			io,
			process,
			network,
			console
		},
		logLevel
	};
}
