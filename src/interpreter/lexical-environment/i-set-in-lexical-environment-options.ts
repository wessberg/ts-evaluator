import {Literal} from "../literal/literal.js";
import {LexicalEnvironment} from "./lexical-environment.js";
import {ReportingOptionsSanitized} from "../reporting/i-reporting-options.js";
import {TS} from "../../type/ts.js";

export interface ISetInLexicalEnvironmentOptions {
	env: LexicalEnvironment;
	path: string;
	value: Literal;
	reporting: ReportingOptionsSanitized;
	node: TS.Node;
	newBinding?: boolean;
}
