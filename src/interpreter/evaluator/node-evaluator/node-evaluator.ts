import {Declaration, Expression, Node, PropertyName, Statement} from "typescript";
import {LexicalEnvironment} from "../../lexical-environment/lexical-environment";
import {Literal} from "../../literal/literal";
import {StatementTraversalStack} from "../../stack/traversal-stack/statement-traversal-stack";

export type NodeWithValue = PropertyName;

export type StatementEvaluator = (node: Statement, environment: LexicalEnvironment) => Promise<void>;
export type DeclarationEvaluator = (node: Declaration, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => Promise<void>;
export type NodeEvaluatorWithArgument = (node: Node, environment: LexicalEnvironment, arg: Literal, statementTraversalStack: StatementTraversalStack) => Promise<void>;
export type ExpressionEvaluator = (node: Expression, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => Promise<Literal>;
export type NodeWithValueEvaluator = (node: NodeWithValue, environment: LexicalEnvironment, statementTraversalStack: StatementTraversalStack) => Promise<Literal>;

export interface NodeEvaluator {
	statement: StatementEvaluator;
	expression: ExpressionEvaluator;
	declaration: DeclarationEvaluator;
	nodeWithArgument: NodeEvaluatorWithArgument;
	nodeWithValue: NodeWithValueEvaluator;
}