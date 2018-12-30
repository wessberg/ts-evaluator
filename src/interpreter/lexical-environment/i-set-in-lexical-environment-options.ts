import {Node} from "typescript";
import {Literal} from "../literal/literal";
import {LexicalEnvironment} from "./lexical-environment";
import {ReportingOptionsSanitized} from "../reporting/i-reporting-options";

export interface ISetInLexicalEnvironmentOptions {
	env: LexicalEnvironment;
	path: string;
	value: Literal;
	reporting: ReportingOptionsSanitized;
	node: Node;
	newBinding?: boolean;
}