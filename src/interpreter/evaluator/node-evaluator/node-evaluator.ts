import {LexicalEnvironment} from "../../lexical-environment/lexical-environment";
import {Literal} from "../../literal/literal";
import {StatementTraversalStack} from "../../stack/traversal-stack/statement-traversal-stack";
import {TS} from "../../../type/ts";

export type NodeWithValue = TS.PropertyName;

export type StatementEvaluator = (node: TS.Statement, environment: LexicalEnvironment) => void;
export type DeclarationEvaluator = (node: TS.Declaration, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => void;
export type NodeEvaluatorWithArgument = (node: TS.Node, environment: LexicalEnvironment, arg: Literal, statementTraversalStack: StatementTraversalStack) => void;
export type ExpressionEvaluator = (node: TS.Expression | TS.PrivateIdentifier, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => Literal;
export type NodeWithValueEvaluator = (node: NodeWithValue, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => Literal;

export interface NodeEvaluator {
	statement: StatementEvaluator;
	expression: ExpressionEvaluator;
	declaration: DeclarationEvaluator;
	nodeWithArgument: NodeEvaluatorWithArgument;
	nodeWithValue: NodeWithValueEvaluator;
}
