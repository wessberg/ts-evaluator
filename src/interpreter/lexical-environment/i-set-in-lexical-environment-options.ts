import {Literal} from "../literal/literal";
import {LexicalEnvironment} from "./lexical-environment";
import {ReportingOptionsSanitized} from "../reporting/i-reporting-options";
import {TS} from "../../type/ts";

export interface ISetInLexicalEnvironmentOptions {
	env: LexicalEnvironment;
	path: string;
	value: Literal;
	reporting: ReportingOptionsSanitized;
	node: TS.Node;
	newBinding?: boolean;
}