import {EvaluatorOptions} from "./evaluator-options.js";
import {TS} from "../../type/ts.js";
import {getFromLexicalEnvironment} from "../lexical-environment/lexical-environment.js";
import {Literal} from "../literal/literal.js";
import {UnexpectedSyntaxError} from "../error/unexpected-syntax-error/unexpected-syntax-error.js";

/**
 * Evaluates, or attempts to evaluate, a MetaProperty.
 */
export function evaluateMetaProperty({node, typescript, environment}: EvaluatorOptions<TS.MetaProperty>): Literal | void {
	switch (node.keywordToken) {
		case typescript.SyntaxKind.NewKeyword: {
			switch (node.name.text) {
				case "target":
					return getFromLexicalEnvironment(node, environment, "[[NewTarget]]")?.literal;
				default:
					throw new UnexpectedSyntaxError({node: node.name});
			}
		}

		case typescript.SyntaxKind.ImportKeyword: {
			switch (node.name.text) {
				case "meta":
					return getFromLexicalEnvironment(node, environment, "import.meta")?.literal;
				default:
					throw new UnexpectedSyntaxError({node: node.name});
			}
		}
	}
}
