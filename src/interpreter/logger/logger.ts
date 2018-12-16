import {LogLevelKind} from "./log-level";
import {Node} from "typescript";
import chalk from "chalk";
import {stringifySyntaxKind} from "../util/syntax-kind/stringify-syntax-kind";
import {Literal, stringifyLiteral} from "../literal/literal";
import {Stack} from "../stack/stack";
import {StatementTraversalStack} from "../stack/traversal-stack/statement-traversal-stack";
import {inspect} from "util";

/**
 * A simple logger for printing evaluation-related info
 */
export class Logger {

	constructor (public readonly logLevel: LogLevelKind) {
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs info output if the log level allows it
	 * @param {string} message
	 */
	public logInfo (message: string): void {
		if (this.logLevel < LogLevelKind.INFO) return;
		console.log(message);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs verbose output if the log level allows it
	 * @param {string} message
	 */
	public logVerbose (message: string): void {
		if (this.logLevel < LogLevelKind.VERBOSE) return;
		console.log(message);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs debug output if the log level allows it
	 * @param {string} message
	 */
	public logDebug (message: string): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(message);
	}

	/**
	 * Logs that a 'continue' keyword appeared within a statement
	 * @param {Node} node
	 */
	public logContinue (node: Node): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`continue`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind))}`);
	}

	/**
	 * Logs that a 'break' keyword appeared within a statement
	 * @param {Node} node
	 */
	public logBreak (node: Node): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`break`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind))}`);
	}

	/**
	 * Logs that a 'return' keyword appeared within a statement
	 * @param {Node} node
	 */
	public logReturn (node: Node): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`${chalk.yellow(`return`)} encountered within ${chalk.yellow(stringifySyntaxKind(node.kind))}`);
	}

	/**
	 * Logs the given result
	 * @param {Literal} result
	 * @param {string} [intermediateContext]
	 */
	public logResult (result: Literal, intermediateContext?: string): void {
		if (this.logLevel < LogLevelKind.INFO) return;
		if (intermediateContext != null) {
			console.log(chalk.gray(`(intermediate value from context '${intermediateContext}'): `), chalk.green(`[RESULT]:`), this.compactValue(result));
		}
		else console.log(chalk.green(`[RESULT]:`), result);
	}

	/**
	 * Logs the given evaluation
	 * @param {Node} node
	 * @param {string} context
	 */
	public logNode (node: Node, context?: string): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;

		let headRaw = `[${stringifySyntaxKind(node.kind)}]`.padEnd(25);
		if (context != null) headRaw += chalk.cyan(`(${context})`);
		const tailRaw = node.getText();

		const head = chalk.yellow(headRaw);
		const tail = chalk.gray(tailRaw);

		console.log(head);
		console.log(tail);
	}

	/**
	 * Logs the given binding
	 * @param {string} lValue
	 * @param {Literal} rValue
	 * @param {string} scope
	 */
	public logBinding (lValue: string, rValue: Literal, scope?: string): void {
		if (this.logLevel < LogLevelKind.VERBOSE) return;
		console.log(`${scope == null ? "" : chalk.green(`(${scope}): `)}${chalk.red(lValue)} ->`, this.compactValue(rValue));
	}

	/**
	 * Logs the heritage of a ClassDeclaration
	 * @param {Function} classDeclaration
	 */
	public logHeritage (classDeclaration: Function): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		const parent = Object.getPrototypeOf(classDeclaration);
		if (parent.toString().includes("[Class")) {
			console.log(`${chalk.cyan(classDeclaration.toString())} ${chalk.yellow("extends")} ${chalk.cyan(parent.toString())}`);
		}
	}

	/**
	 * Logs the newest value has been pushed onto the Stack
	 * @param {Literal[]} stack
	 */
	public logStack (stack: Stack): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`Stack value: ${chalk.blue(stringifyLiteral(this.compactValue(stack[stack.length - 1])))}`);
	}

	// noinspection JSUnusedGlobalSymbols
	/**
	 * Logs the entire Traversal Stack
	 * @param {StatementTraversalStack} stack
	 */
	public logStatementTraversalStack (stack: StatementTraversalStack): void {
		if (this.logLevel < LogLevelKind.DEBUG) return;
		console.log(`[${stack.map(kind => chalk.blue(stringifySyntaxKind(kind))).join(", ")}]`);
	}

	/**
	 * Makes a value compact so it is easier on the eyes when printing it
	 * @param {T} value
	 * @return {string}
	 */
	private compactValue<T> (value: T): string {
		return inspect(value, {depth: 0, colors: true, compact: true, maxArrayLength: 5});
	}
}