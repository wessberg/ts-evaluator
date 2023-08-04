import type {TS} from "../../../type/ts.js";

/**
 * Returns true if the given VariableDeclarationList is declared with a 'var' keyword
 */
export function isVarDeclaration(declarationList: TS.VariableDeclarationList, typescript: typeof TS): boolean {
	return declarationList.flags !== typescript.NodeFlags.Const && declarationList.flags !== typescript.NodeFlags.Let;
}
