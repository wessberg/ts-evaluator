import {LogLevelKind} from "../src/interpreter/logger/log-level";
import {evaluate} from "../src/interpreter/evaluate";
import {EvaluateResult} from "../src/interpreter/evaluate-result";
import {IEvaluatePolicy} from "../src/interpreter/policy/i-evaluate-policy";
import {Dirent, readdirSync} from "fs";
import fastGlob from "fast-glob";
import {IEnvironment} from "../src/interpreter/environment/i-environment";
import {ReportingOptions} from "../src/interpreter/reporting/i-reporting-options";
import {dirname, isAbsolute, join, normalize, sep} from "path";
import slash from "slash";
import {TS} from "../src/type/ts";

/**
 * Gets the NewLineCharacter to use for a NewLineKind
 */
function getNewLineCharacter(newLine: TS.NewLineKind, typescript: typeof TS): string {
	switch (newLine) {
		case typescript.NewLineKind.CarriageReturnLineFeed:
			return "\r\n";
		case typescript.NewLineKind.LineFeed:
			return "\n";
	}
}

const _process = process;

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
	cwd: string;
}

/**
 * Prepares a test
 */
export function prepareTest(
	inputFiles: TestFile[] | TestFile,
	entry?: TestFileEntry | undefined,
	{
		typescript = TS,
		environment,
		cwd = _process.cwd(),
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
	const files: ITestFile[] = (Array.isArray(inputFiles) ? inputFiles : [inputFiles])
		.map(file =>
			typeof file === "string"
				? {
						text: file,
						fileName: `auto-generated-${Math.floor(Math.random() * 100000)}.ts`,
						entry: true
				  }
				: file
		)
		.map(file => ({...file, fileName: join(cwd, file.fileName)}));

	const directories = new Set(files.map(file => normalize(dirname(file.fileName))));
	const normalizedEntry = typeof entry === "string" || entry == null ? {fileName: files[0].fileName, match: entry == null ? "" : entry} : entry;
	const rootNames = files.map(({fileName}) => fileName);
	const compilerOptions = typescript.getDefaultCompilerOptions();

	const program = typescript.createProgram({
		rootNames,
		host: {
			readFile(fileName: string): string | undefined {
				const normalized = normalize(fileName);
				const absoluteFileName = isAbsolute(normalized) ? normalized : join(cwd, normalized);

				const file = files.find(currentFile => currentFile.fileName === absoluteFileName);
				if (file != null) return file.text;
				return typescript.sys.readFile(absoluteFileName);
			},

			fileExists(fileName: string): boolean {
				const normalized = normalize(fileName);
				const absoluteFileName = isAbsolute(normalized) ? normalized : join(cwd, normalized);
				if (files.some(file => file.fileName === absoluteFileName)) {
					return true;
				}
				return typescript.sys.fileExists(absoluteFileName);
			},

			directoryExists: dirName => {
				const normalized = normalize(dirName);
				if (directories.has(normalized)) return true;
				return typescript.sys.directoryExists(normalized);
			},
			realpath(path: string): string {
				return normalize(path);
			},
			readDirectory(rootDir: string, extensions: readonly string[], excludes: readonly string[] | undefined, includes: readonly string[], depth?: number): string[] {
				const nativeNormalizedRootDir = normalize(rootDir);
				const realResult = typescript.sys.readDirectory(rootDir, extensions, excludes, includes, depth);

				// Making the glob filter of the virtual file system to match the behavior of TypeScript as close as possible.
				const virtualFiles = fastGlob
					.sync([...includes], {
						cwd: nativeNormalizedRootDir,
						ignore: [...(excludes ?? [])],
						fs: {
							readdirSync: ((path: string, {withFileTypes}: {withFileTypes?: boolean}) => {
								path = normalize(path);

								return files
									.filter(file => file.fileName.startsWith(path))
									.map(file => {
										const fileName = file.fileName.slice(path.length + 1, file.fileName.includes(sep, path.length + 1) ? file.fileName.indexOf(sep, path.length + 1) : undefined);

										const isDirectory = !file.fileName.endsWith(fileName);
										const isFile = file.fileName.endsWith(fileName);

										return withFileTypes === true
											? ({
													name: fileName,
													isDirectory() {
														return isDirectory;
													},
													isFile() {
														return isFile;
													},
													isSymbolicLink() {
														return false;
													}
											  } as Partial<Dirent>)
											: fileName;
									});
							}) as unknown as typeof readdirSync
						}
					})
					.map(file => join(nativeNormalizedRootDir, file));

				return [...new Set([...realResult, ...virtualFiles])].map(normalize);
			},

			getDirectories(path: string): string[] {
				return typescript.sys.getDirectories(path).map(normalize);
			},

			getSourceFile(fileName: string, languageVersion: TS.ScriptTarget): TS.SourceFile | undefined {
				const sourceText = this.readFile(fileName);
				if (sourceText == null) return undefined;

				return typescript.createSourceFile(slash(fileName), sourceText, languageVersion, true, typescript.ScriptKind.TS);
			},

			getCurrentDirectory() {
				return normalize(cwd);
			},

			getDefaultLibFileName(options: TS.CompilerOptions): string {
				return typescript.getDefaultLibFileName(options);
			},

			getCanonicalFileName(fileName: string): string {
				return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
			},

			getNewLine(): string {
				return compilerOptions.newLine != null ? getNewLineCharacter(compilerOptions.newLine, typescript) : typescript.sys.newLine;
			},

			useCaseSensitiveFileNames() {
				return typescript.sys.useCaseSensitiveFileNames;
			},

			writeFile: () => {
				// Noop
			}
		},
		options: compilerOptions
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
