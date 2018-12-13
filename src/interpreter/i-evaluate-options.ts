import {Declaration, Expression, Statement, TypeChecker} from "typescript";
import {LexicalEnvironment} from "./lexical-environment/lexical-environment";
import {LogLevelKind} from "./logger/log-level";
import {IEvaluatePolicy} from "./policy/i-evaluate-policy";

export interface IEvaluateOptions {
	node: Statement|Declaration|Expression;
	typeChecker: TypeChecker;
	environment?: LexicalEnvironment["env"];
	logLevel?: LogLevelKind;
	policy?: Partial<IEvaluatePolicy>;
}