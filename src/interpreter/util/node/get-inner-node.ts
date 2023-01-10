import { TS } from "../../../type/ts.js";

export function getInnerNode<T extends TS.Node>(node: TS.Node, typescript: typeof TS): T {
	if (typescript.isParenthesizedExpression(node)) return getInnerNode(node.expression, typescript);
	else if (typescript.isAsExpression(node)) return getInnerNode(node.expression, typescript);
	else if (typescript.isTypeAssertionExpression?.(node) || (!("isTypeAssertionExpression" in typescript) && (typescript as typeof TS).isTypeAssertion(node))) {
		return getInnerNode(node.expression, typescript);
	}
	else {
		return node as T;
	}
}
