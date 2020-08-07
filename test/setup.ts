import {LogLevelKind} from "../src/interpreter/logger/log-level";
import {evaluate} from "../src/interpreter/evaluate";
import {EvaluateResult} from "../src/interpreter/evaluate-result";
import {IEvaluatePolicy} from "../src/interpreter/policy/i-evaluate-policy";
import {readFileSync, readdirSync} from "fs";
import {IEnvironment} from "../src/interpreter/environment/i-environment";
import {ReportingOptions} from "../src/interpreter/reporting/i-reporting-options";
import {sync} from "find-up";
import {join, normalize} from "path";
import slash from "slash";
import {TS} from "../src/type/ts";

// tslint:disable:no-any

export interface ITestFile {
	fileName: string;
	text: string;
}

export type TestFile = ITestFile | string;

export interface ITestFileEntry {
	fileName: string;
	match: string;
}

export type TestFileEntry = ITestFileEntry | string;

export interface ITestFileResult {
	evaluate(): EvaluateResult;
}

export interface ITestOpts {
	policy: Partial<IEvaluatePolicy>;
	environment: Partial<IEnvironment>;
	reporting: ReportingOptions;
	logLevel: LogLevelKind;
	typescript: typeof TS;
}

/**
 * Prepares a test
 */
export function prepareTest(
	files: TestFile[] | TestFile,
	entry?: TestFileEntry | undefined,
	{
		typescript = TS,
		environment,
		policy: {
			deterministic = true,
			maxOps = Infinity,
			maxOpDuration = Infinity,
			console = false,
			network = false,
			io = {
				read: true,
				write: false
			},
			process = {
				exit: false,
				spawnChild: false
			}
		} = {},
		reporting,
		logLevel = LogLevelKind.SILENT
	}: Partial<ITestOpts> = {}
): ITestFileResult {
	const arrFiles = Array.isArray(files) ? files : [files];
	const nodeTypesDir = sync(normalize("node_modules/@types/node"), {type: "directory"});
	const nodeTypeDeclarationFiles =
		nodeTypesDir == null
			? []
			: readdirSync(nodeTypesDir)
					.filter(file => file.endsWith(".d.ts"))
					.map(file => join(nodeTypesDir, file));

	const normalizedFiles: ITestFile[] = [
		...arrFiles.map(file => (typeof file === "string" ? {text: file, fileName: `auto-generated-${Math.floor(Math.random() * 100000)}.ts`} : file)),
		...nodeTypeDeclarationFiles.map(file => ({
			fileName: file,
			text: readFileSync(normalize(file), "utf8")
		}))
	]
		.map(file => ({
			...file,
			fileName: slash(file.fileName)
		}));

	const normalizedEntry =
		typeof entry === "string" || entry == null ? {fileName: normalizedFiles[0].fileName, match: entry == null ? "" : entry} : entry;

	const rootNames = normalizedFiles.map(({fileName}) => fileName);

	const program = typescript.createProgram({
		rootNames,
		host: {
			readFile(fileName: string): string | undefined {
				const matchedFile = normalizedFiles.find(file => file.fileName === slash(fileName));
				return matchedFile == null ? undefined : matchedFile.text;
			},

			fileExists(fileName: string): boolean {
				return this.readFile(fileName) != null;
			},

			getSourceFile(fileName: string, languageVersion: TS.ScriptTarget): TS.SourceFile | undefined {
				const sourceText = this.readFile(fileName);
				if (sourceText == null) return undefined;

				return typescript.createSourceFile(slash(fileName), sourceText, languageVersion, true, typescript.ScriptKind.TS);
			},

			getCurrentDirectory() {
				return ".";
			},

			getDirectories(directoryName: string) {
				return typescript.sys.getDirectories(slash(directoryName)).map(slash);
			},

			getDefaultLibFileName(options: TS.CompilerOptions): string {
				return slash(typescript.getDefaultLibFileName(options));
			},

			getCanonicalFileName(fileName: string): string {
				return slash(this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase());
			},

			getNewLine(): string {
				return typescript.sys.newLine;
			},

			useCaseSensitiveFileNames() {
				return typescript.sys.useCaseSensitiveFileNames;
			},

			writeFile: () => {
				// Noop
			}
		},
		options: typescript.getDefaultCompilerOptions()
	});

	const entrySourceFile = program.getSourceFile(normalizedEntry.fileName);
	if (entrySourceFile == null) {
		throw new ReferenceError(`No such SourceFile: '${normalizedEntry.fileName}'`);
	}

	const entryNode = findEntryExpressionFromStatements(entrySourceFile.statements, normalizedEntry.match, typescript);

	return {
		evaluate: () =>
			evaluate({
				node: entryNode,
				typeChecker: program.getTypeChecker(),
				typescript,
				environment,
				reporting,
				policy: {
					maxOps,
					maxOpDuration,
					deterministic,
					io,
					process,
					network,
					console
				},
				logLevel
			})
	};
}

/**
 * Finds an entry node that matches the given text with a NodeArray of Statements
 */
function findEntryExpressionFromStatements(statements: TS.NodeArray<TS.Statement>, match: string, typescript: typeof TS): TS.Expression {
	for (const statement of statements) {
		const matchedNode = matchNode(statement, match, typescript);
		if (matchedNode != null) return matchedNode;
	}
	throw new ReferenceError(`Could not match: '${match}' inside NodeArray of Statements`);
}

/**
 * Checks if the given text matches the given node or any of its' children
 */
function matchNode(node: TS.Node, match: string, typescript: typeof TS): TS.Expression | undefined {
	if (isNodeMatched(node, match)) return node;
	return typescript.forEachChild(node, nextNode => matchNode(nextNode, match, typescript));
}

/**
 * Returns true if the given Node matches the given text
 */
function isNodeMatched(node: TS.Node, match: string): node is TS.Expression {
	try {
		if (node.getText().startsWith(match)) return true;
	} catch {}
	return false;
}
