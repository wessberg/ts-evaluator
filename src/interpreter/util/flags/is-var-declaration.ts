import {NodeFlags, VariableDeclarationList} from "typescript";

/**
 * Returns true if the given VariableDeclarationList is declared with a 'var' keyword
 * @param {VariableDeclarationList} declarationList
 * @return {boolean}
 */
export function isVarDeclaration (declarationList: VariableDeclarationList): boolean {
	return declarationList.flags !== NodeFlags.Const && declarationList.flags !== NodeFlags.Let;
}