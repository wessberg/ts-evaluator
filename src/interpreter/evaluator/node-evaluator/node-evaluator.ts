import type {Literal} from "../../literal/literal.js";
import type {TS} from "../../../type/ts.js";
import type { NextEvaluatorOptions } from "../evaluator-options.js";
import type { EvaluationError } from "../../error/evaluation-error/evaluation-error.js";

export type NodeWithValue = TS.PropertyName;

export type StatementEvaluator = (node: TS.Statement, nextOptions: NextEvaluatorOptions) => void;
export type DeclarationEvaluator = (node: TS.Declaration, nextOptions: NextEvaluatorOptions) => void;
export type NodeEvaluatorWithArgument = (node: TS.Node, arg: Literal, nextOptions: NextEvaluatorOptions) => void;
export type ExpressionEvaluator = (node: TS.Expression | TS.PrivateIdentifier, nextOptions: NextEvaluatorOptions) => Literal|EvaluationError;
export type NodeWithValueEvaluator = (node: NodeWithValue, nextOptions: NextEvaluatorOptions) => Literal|EvaluationError;

export interface NodeEvaluator {
	statement: StatementEvaluator;
	expression: ExpressionEvaluator;
	declaration: DeclarationEvaluator;
	nodeWithArgument: NodeEvaluatorWithArgument;
	nodeWithValue: NodeWithValueEvaluator;
}
