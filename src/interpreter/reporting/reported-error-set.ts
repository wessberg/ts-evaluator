export type ReportedErrorSet = WeakSet<Error>;

/**
 * Creates and returns a Set of Errors that has been seen and has been reported
 * @returns {WeakSet<Error>}
 */
export function createReportedErrorSet(): ReportedErrorSet {
	return new WeakSet<Error>();
}
