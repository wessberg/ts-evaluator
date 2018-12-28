import {Node} from "typescript";
import {Literal} from "../literal/literal";

export interface IBindingReportEntry {
	path: string;
	value: Literal;
	node: Node;
}

export interface ITraversalReportEntry {
	node: Node;
}

export type BindingReportCallback = (entry: IBindingReportEntry) => void|(Promise<void>);
export type TraversalReportCallback = (entry: ITraversalReportEntry) => void|(Promise<void>);

export interface IReportingOptions {
	reportBindings: BindingReportCallback;
	reportTraversal: TraversalReportCallback;
}

export type ReportingOptions = Partial<IReportingOptions>;