import {LogLevelKind} from "./logger/log-level";
import {IEvaluatePolicy} from "./policy/i-evaluate-policy";
import {IEnvironment} from "./environment/i-environment";
import {ReportingOptions} from "./reporting/i-reporting-options";
import {TS} from "../type/ts";


export interface IEvaluateOptions {
	node: TS.Statement|TS.Declaration|TS.Expression;
	typeChecker: TS.TypeChecker;
	typescript?: typeof TS;
	environment?: Partial<IEnvironment>;
	logLevel?: LogLevelKind;
	policy?: Partial<IEvaluatePolicy>;
	reporting?: ReportingOptions;
}