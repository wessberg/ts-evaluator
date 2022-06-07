import {Literal} from "../../literal/literal.js";

export interface IGenerateClassDeclarationOptions {
	name: string;
	extendedType: Literal;
	ctor: CallableFunction;
}
