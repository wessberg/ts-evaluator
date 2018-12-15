import {Declaration, Expression, Statement, TypeChecker} from "typescript";
import {LogLevelKind} from "./logger/log-level";
import {IEvaluatePolicy} from "./policy/i-evaluate-policy";
import {IEnvironment} from "./environment/i-environment";

export interface IEvaluateOptions {
	node: Statement|Declaration|Expression;
	typeChecker: TypeChecker;
	environment?: Partial<IEnvironment>;
	logLevel?: LogLevelKind;
	policy?: Partial<IEvaluatePolicy>;
}