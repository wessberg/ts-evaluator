import {Expression, Node} from "typescript";
import {ReportedErrorSet} from "./reported-error-set";

export interface IBindingReportEntry {
	path: string;
	value: unknown;
	node: Node;
}

export interface ITraversalReportEntry {
	node: Node;
}

export interface IIntermediateResultReportEntry {
	node: Expression;
	value: unknown;
}

export interface IErrorReportEntry {
	node: Node;
	error: Error;
}

export type BindingReportCallback = (entry: IBindingReportEntry) => void|(Promise<void>);
export type ErrorReportCallback = (entry: IErrorReportEntry) => void|(Promise<void>);
export type IntermediateResultReportCallback = (entry: IIntermediateResultReportEntry) => void|(Promise<void>);
export type TraversalReportCallback = (entry: ITraversalReportEntry) => void|(Promise<void>);

export interface IReportingOptions {
	reportBindings: BindingReportCallback;
	reportTraversal: TraversalReportCallback;
	reportIntermediateResults: IntermediateResultReportCallback;
	reportErrors: ErrorReportCallback;
}

export type ReportingOptions = Partial<IReportingOptions>;

export interface ReportingOptionsSanitized extends ReportingOptions {
	reportedErrorSet: ReportedErrorSet;
}