import {TS} from "../../../type/ts.js";

export function getInnerNode<T extends TS.Node>(node: TS.Node, typescript: typeof TS): T {
	if (typescript.isParenthesizedExpression(node)) return getInnerNode(node.expression, typescript);
	else if (typescript.isAsExpression(node)) return getInnerNode(node.expression, typescript);
	else if (typescript.isTypeAssertionExpression?.(node) || (!("isTypeAssertionExpression" in typescript) && (typescript as any).isTypeAssertion(node))) {
		return getInnerNode((node as TS.TypeAssertion).expression, typescript);
	} else {
		return node as T;
	}
}
