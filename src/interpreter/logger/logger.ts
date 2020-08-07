import {LogLevelKind} from "./log-level";
import chalk from "chalk";
import {stringifySyntaxKind} from "../util/syntax-kind/stringify-syntax-kind";
import {Literal, stringifyLiteral} from "../literal/literal";
import {Stack} from "../stack/stack";
import {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";
import {inspect} from "util";
import {TS} from "../../type/ts";

/**
 * A simple logger for printing evaluation-related info
 */
export class Logger {
	constructor(readonly logLevel: LogLevelKind) {}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs info output if the log level allows it
	 */
	logInfo(message: string): void {
		if (this.logLevel < LogLevelKind.INFO) return;
		console.log(message);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs verbose output if the log level allows it
	 */
	logVerbose(message: string): void {
		if (this.logLevel < LogLevelKind.VERBOSE) return;
		console.log(message);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs debug output if the log level allows it
	 */
	logDebug(message: string): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(message);
	}

	/**
	 * Logs that a 'continue' keyword appeared within a statement
	 */
	logContinue(node: TS.Node, typescript: typeof TS): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`continue`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind, typescript))}`);
	}

	/**
	 * Logs that a 'break' keyword appeared within a statement
	 */
	logBreak(node: TS.Node, typescript: typeof TS): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`break`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind, typescript))}`);
	}

	/**
	 * Logs that a 'return' keyword appeared within a statement
	 */
	logReturn(node: TS.Node, typescript: typeof TS): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`return`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind, typescript))}`);
	}

	/**
	 * Logs the given result
	 */
	logResult(result: Literal, intermediateContext?: string): void {
		if (this.logLevel < LogLevelKind.INFO) return;
		if (intermediateContext != null) {
			console.log(chalk.gray(`(intermediate value from context '${intermediateContext}'): `), chalk.green(`[RESULT]:`), this.compactValue(result));
		} else console.log(chalk.green(`[RESULT]:`), result);
	}

	/**
	 * Logs the given evaluation
	 */
	logNode(node: TS.Node, typescript: typeof TS, context?: string): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;

		let headRaw = `[${stringifySyntaxKind(node.kind, typescript)}]`.padEnd(25);
		if (context != null) headRaw += chalk.cyan(`(${context})`);
		const tailRaw = node.getText();

		const head = chalk.yellow(headRaw);
		const tail = chalk.gray(tailRaw);

		console.log(head);
		console.log(tail);
	}

	/**
	 * Logs the given binding
	 */
	logBinding(lValue: string, rValue: Literal, scope?: string): void {
		if (this.logLevel < LogLevelKind.VERBOSE) return;
		console.log(`${scope == null ? "" : chalk.green(`(${scope}): `)}${chalk.red(lValue)} ->`, this.compactValue(rValue));
	}

	/**
	 * Logs the heritage of a ClassDeclaration
	 */
	logHeritage(classDeclaration: CallableFunction): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		const parent = Object.getPrototypeOf(classDeclaration);
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		if (parent.toString().includes("[Class")) {
			console.log(`${chalk.cyan(classDeclaration.toString())} ${chalk.yellow("extends")} ${chalk.cyan(parent.toString())}`);
		}
	}

	/**
	 * Logs the newest value has been pushed onto the Stack
	 */
	logStack(stack: Stack): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`Stack value: ${chalk.blue(stringifyLiteral(this.compactValue(stack.lastItem)))}`);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs the entire Traversal Stack
	 */
	logStatementTraversalStack(stack: StatementTraversalStack, typescript: typeof TS): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`[${stack.map(kind => chalk.blue(stringifySyntaxKind(kind, typescript))).join(", ")}]`);
	}

	/**
	 * Makes a value compact so it is easier on the eyes when printing it
	 */
	private compactValue<T>(value: T): string {
		return inspect(value, {depth: 0, colors: true, compact: true, maxArrayLength: 5});
	}
}
