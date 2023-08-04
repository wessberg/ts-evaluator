import type {ReportedErrorSet} from "./reported-error-set.js";
import type {TS} from "../../type/ts.js";

export interface IBindingReportEntry {
	path: string;
	value: unknown;
	node: TS.Node;
}

export interface ITraversalReportEntry {
	node: TS.Node;
}

export interface IIntermediateResultReportEntry {
	node: TS.Expression | TS.PrivateIdentifier;
	value: unknown;
}

export interface IErrorReportEntry {
	node: TS.Node;
	error: Error;
}

export type BindingReportCallback = (entry: IBindingReportEntry) => void | Promise<void>;
export type ErrorReportCallback = (entry: IErrorReportEntry) => void | Promise<void>;
export type IntermediateResultReportCallback = (entry: IIntermediateResultReportEntry) => void | Promise<void>;
export type TraversalReportCallback = (entry: ITraversalReportEntry) => void | Promise<void>;

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
