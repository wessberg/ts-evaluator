// tslint:disable:no-any
import {Logger} from "../../../logger/logger";
import {LogLevelKind} from "../../../logger/log-level";

/**
 * A side-effect free mock of the console object (unless the logLevel is greater than or equal to 'INFO'
 */
export const console: (logger: Logger) => Console = logger => logger.logLevel >= LogLevelKind.INFO
	? Object.freeze(global.console)
	: ({

		Console: <new () => Console>class {
			constructor () {
				return console;
			}
		},

		memory: {
			jsHeapSizeLimit: Infinity,
			totalJSHeapSize: Infinity,
			usedJSHeapSize: Infinity
		},

		countReset (): void {
		},
		timeLog (): void {
		},

		assert (): void {
		},

		clear (): void {
		},

		count (): void {
		},

		debug (): void {
		},

		dir (): void {
		},

		dirxml (): void {
		},

		error (): void {
		},

		exception (): void {
		},

		group (): void {
		},

		groupCollapsed (): void {
		},

		groupEnd (): void {
		},

		info (): void {
		},

		log (): void {
		},

		markTimeline (): void {
		},

		profile (): void {
		},

		profileEnd (): void {
		},

		table (): void {
		},

		time (): void {
		},

		timeEnd (): void {
		},

		timeStamp (): void {
		},

		timeline (): void {
		},

		timelineEnd (): void {
		},

		trace (): void {
		},

		warn (): void {
		}

	});