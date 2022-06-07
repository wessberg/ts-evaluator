import {PartialExcept} from "helpertypes";
import {EvaluateOptions} from "../../src/interpreter/evaluate-options.js";
import {LogLevelKind} from "../../src/interpreter/logger/log-level.js";

const _process = process;
export interface TestContext extends PartialExcept<Required<EvaluateOptions>, "typescript"> {
	cwd: string;
}

export function createTestContext({
	typescript,
	environment,
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
		reporting,
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
