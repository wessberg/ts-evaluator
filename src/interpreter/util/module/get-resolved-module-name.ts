import path from "crosspath";
import type { TS } from "../../../type/ts.js";
import type { EvaluatorOptions } from "../../evaluator/evaluator-options.js";

export function getResolvedModuleName (moduleSpecifier: string, options: EvaluatorOptions<TS.Node>): string {
    const {node, typescript} = options;
    if (!typescript.isExternalModuleNameRelative(moduleSpecifier)) {
        return moduleSpecifier;
    }

    const parentPath = node.getSourceFile().fileName;
    return path.join(path.dirname(parentPath), moduleSpecifier);
}