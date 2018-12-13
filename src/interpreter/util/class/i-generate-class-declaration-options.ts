import {Literal} from "../../literal/literal";

export interface IGenerateClassDeclarationOptions {
	name: string;
	extendedType: Literal;
	ctor: Function;
}