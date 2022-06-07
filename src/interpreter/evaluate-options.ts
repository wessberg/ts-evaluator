import {LogLevelKind} from "./logger/log-level.js";
import {EvaluatePolicy} from "./policy/evaluate-policy.js";
import {IEnvironment} from "./environment/i-environment.js";
import {ReportingOptions} from "./reporting/i-reporting-options.js";
import {TS} from "../type/ts.js";

export interface EvaluateOptions {
	node: TS.Statement | TS.Declaration | TS.Expression;
	typeChecker: TS.TypeChecker;
	typescript?: typeof TS;
	environment?: Partial<IEnvironment>;
	logLevel?: LogLevelKind;
	policy?: Partial<EvaluatePolicy>;
	reporting?: ReportingOptions;
}
