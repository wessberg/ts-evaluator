import {LogLevelKind} from "./log-level";
import {stringifySyntaxKind} from "../util/syntax-kind/stringify-syntax-kind";
import {Literal, stringifyLiteral} from "../literal/literal";
import {Stack} from "../stack/stack";
import {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";
import {inspect} from "util";
import {TS} from "../../type/ts";
import {PartialDeep} from "helpertypes";
import {loadChalk} from "../util/loader/optional-peer-dependency-loader";

export type LoggerColor = "white" | "cyan" | "yellow" | "magenta" | "gray" | "red";

export interface LoggerColorOptions {
	info: LoggerColor;
	verbose: LoggerColor;
	debug: LoggerColor;
}

export interface LoggerOptions {
	logLevel: LogLevelKind;
	color: LoggerColorOptions;
}

/**
 * A simple logger for printing evaluation-related info
 */
export class Logger {
	private readonly options: LoggerOptions;

	constructor(logLevel?: LogLevelKind);
	constructor(options?: PartialDeep<LoggerOptions>);
	constructor(optionsOrLogLevel?: LogLevelKind | PartialDeep<LoggerOptions>);
	constructor(optionsOrLogLevel: LogLevelKind | PartialDeep<LoggerOptions> = {}) {
		const {logLevel = LogLevelKind.SILENT, color: {info = "white", verbose = "yellow", debug = "magenta"} = {}} =
			typeof optionsOrLogLevel === "object" ? optionsOrLogLevel : {logLevel: optionsOrLogLevel};
		this.options = {
			logLevel,
			color: {
				info,
				verbose,
				debug
			}
		};
	}

	/**
	 * Logs info output if the log level allows it
	 */
	logInfo(message: string): void {
		if (this.options.logLevel < LogLevelKind.INFO) return;
		console.log(this.formatWithColor(this.options.color.info, message));
	}

	/**
	 * Logs verbose output if the log level allows it
	 */
	logVerbose(message: string): void {
		if (this.options.logLevel < LogLevelKind.VERBOSE) return;
		console.log(this.formatWithColor(this.options.color.verbose, message));
	}

	/**
	 * Logs debug output if the log level allows it
	 */
	logDebug(message: string): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(this.formatWithColor(this.options.color.debug, message));
	}

	/**
	 * Logs that a 'continue' keyword appeared within a statement
	 */
	logContinue(node: TS.Node, typescript: typeof TS): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(
			`${this.formatWithColor(this.options.color.debug, `continue`)} encountered within ${this.formatWithColor(
				this.options.color.debug,
				stringifySyntaxKind(node.kind, typescript)
			)}`
		);
	}

	/**
	 * Logs that a 'break' keyword appeared within a statement
	 */
	logBreak(node: TS.Node, typescript: typeof TS): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(
			`${this.formatWithColor(this.options.color.debug, `break`)} encountered within ${this.formatWithColor(this.options.color.debug, stringifySyntaxKind(node.kind, typescript))}`
		);
	}

	/**
	 * Logs that a 'return' keyword appeared within a statement
	 */
	logReturn(node: TS.Node, typescript: typeof TS): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(
			`${this.formatWithColor(this.options.color.debug, `return`)} encountered within ${this.formatWithColor(this.options.color.debug, stringifySyntaxKind(node.kind, typescript))}`
		);
	}

	/**
	 * Logs the given result
	 */
	logResult(result: Literal, intermediateContext?: string): void {
		if (this.options.logLevel < LogLevelKind.INFO) return;
		if (intermediateContext != null) {
			console.log(
				this.formatWithColor(this.options.color.info, `(intermediate value from context '${intermediateContext}'):`),
				this.formatWithColor(this.options.color.info, `[RESULT]:`),
				this.compactValue(result)
			);
		} else {
			console.log(this.formatWithColor(this.options.color.info, `[RESULT]:`), result);
		}
	}

	/**
	 * Logs the given evaluation
	 */
	logNode(node: TS.Node, typescript: typeof TS, context?: string): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;

		let headRaw = `[${stringifySyntaxKind(node.kind, typescript)}]`.padEnd(25);
		if (context != null) headRaw += this.formatWithColor(this.options.color.debug, `(${context})`);
		const tailRaw = node.getText();

		const head = this.formatWithColor(this.options.color.debug, headRaw);
		const tail = this.formatWithColor(this.options.color.debug, tailRaw);

		console.log(head);
		console.log(tail);
	}

	/**
	 * Logs the given binding
	 */
	logBinding(lValue: string, rValue: Literal, scope?: string): void {
		if (this.options.logLevel < LogLevelKind.VERBOSE) return;
		console.log(
			`${scope == null ? "" : this.formatWithColor(this.options.color.verbose, `(${scope}): `)}${this.formatWithColor(this.options.color.verbose, `${lValue} ->`)}`,
			this.formatWithColor(this.options.color.verbose, this.compactValue(rValue))
		);
	}

	/**
	 * Logs the heritage of a ClassDeclaration
	 */
	logHeritage(classDeclaration: CallableFunction): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		const parent = Object.getPrototypeOf(classDeclaration);
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		if (parent.toString().includes("[Class")) {
			console.log(
				`${this.formatWithColor(this.options.color.debug, classDeclaration.toString())} ${this.formatWithColor(this.options.color.debug, `extends`)} ${this.formatWithColor(
					this.options.color.debug,
					parent.toString()
				)}`
			);
		}
	}

	/**
	 * Logs the newest value has been pushed onto the Stack
	 */
	logStack(stack: Stack): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(this.formatWithColor(this.options.color.debug, `Stack value: ${stringifyLiteral(this.compactValue(stack.lastItem))}`));
	}

	/**
	 * Logs the entire Traversal Stack
	 */
	logStatementTraversalStack(stack: StatementTraversalStack, typescript: typeof TS): void {
		if (this.options.logLevel < LogLevelKind.DEBUG) return;
		console.log(this.formatWithColor(this.options.color.debug, `[${stack.map(kind => stringifySyntaxKind(kind, typescript)).join(", ")}]`));
	}

	/**
	 * Makes a value compact so it is easier on the eyes when printing it
	 */
	private compactValue<T>(value: T): string {
		return inspect(value, {depth: 0, colors: true, compact: true, maxArrayLength: 5});
	}

	private formatWithColor(color: LoggerColor, message: string): string {
		const chalk = loadChalk(false);
		return chalk != null ? chalk[color](message) : message;
	}
}
