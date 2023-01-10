import { TS } from "../../../type/ts";

export function canHaveModifiers(node: TS.Node, typescript: typeof TS): node is TS.HasModifiers {
    if ("canHaveModifiers" in typescript) {
        return typescript.canHaveModifiers(node);
    } else {
        return true;
    }
}
export function getModifiers(node: TS.HasModifiers, typescript: typeof TS): readonly TS.Modifier[] | undefined {
    if ("getModifiers" in typescript) {
        return typescript.getModifiers(node);
    } else {
        return node.modifiers?.filter(modifier => !("expression" in modifier)) as readonly TS.Modifier[] | undefined;
    }
}

export function canHaveDecorators(node: TS.Node, typescript: typeof TS): node is TS.HasDecorators {
    if ("canHaveDecorators" in typescript) {
        return typescript.canHaveDecorators(node);
    } else {
        return true;
    }
}
export function getDecorators(node: TS.HasDecorators, typescript: typeof TS): readonly TS.Decorator[] | undefined {
    if ("getDecorators" in typescript) {
        return typescript.getDecorators(node);
    } else {

        const legacyDecorators = "decorators" in node && Array.isArray(node.decorators) ? node.decorators : undefined;
        const decoratorModifierLikes = node.modifiers?.filter(modifier => ("expression" in modifier)) as readonly TS.Decorator[] | undefined;
        return [...(legacyDecorators ?? []), ...(decoratorModifierLikes ?? [])];
    }
}