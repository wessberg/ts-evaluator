import {Expression, Node} from "typescript";

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

export type BindingReportCallback = (entry: IBindingReportEntry) => void|(Promise<void>);
export type IntermediateResultReportCallback = (entry: IIntermediateResultReportEntry) => void|(Promise<void>);
export type TraversalReportCallback = (entry: ITraversalReportEntry) => void|(Promise<void>);

export interface IReportingOptions {
	reportBindings: BindingReportCallback;
	reportTraversal: TraversalReportCallback;
	reportIntermediateResults: IntermediateResultReportCallback;
}

export type ReportingOptions = Partial<IReportingOptions>;