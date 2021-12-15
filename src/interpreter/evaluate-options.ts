import {LogLevelKind} from "./logger/log-level";
import {EvaluatePolicy} from "./policy/evaluate-policy";
import {IEnvironment} from "./environment/i-environment";
import {ReportingOptions} from "./reporting/i-reporting-options";
import {TS} from "../type/ts";

export interface EvaluateOptions {
	node: TS.Statement | TS.Declaration | TS.Expression;
	typeChecker: TS.TypeChecker;
	typescript?: typeof TS;
	environment?: Partial<IEnvironment>;
	logLevel?: LogLevelKind;
	policy?: Partial<EvaluatePolicy>;
	reporting?: ReportingOptions;
}
