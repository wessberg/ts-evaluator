import type {TS} from "../../src/type/ts.js";
import type {TestResult} from "./test-result.js";
import type {TestFile, TestFileEntry} from "./test-file.js";
import {createBuiltInModuleTestFiles} from "./test-file.js";
import type {TestContext} from "./test-context.js";
import {createTestSetup} from "./test-setup.js";
import type {MaybeArray, PartialExcept} from "helpertypes";
import path from "crosspath";
import {evaluate} from "../../src/interpreter/evaluate.js";
import {ensureArray} from "../../src/interpreter/util/array/ensure-array.js";

/**
 * Prepares a test
 */
export function executeProgram(inputFiles: MaybeArray<TestFile>, inputEntry: TestFileEntry, options: PartialExcept<TestContext, "typescript">): TestResult;
export function executeProgram(inputFiles: MaybeArray<TestFile>, options: PartialExcept<TestContext, "typescript">): TestResult;
export function executeProgram(
	inputFiles: MaybeArray<TestFile>,
	inputEntryOrOptions: TestFileEntry | PartialExcept<TestContext, "typescript">,
	optionsOrUndefined?: PartialExcept<TestContext, "typescript"> | undefined
): TestResult {
	const [firstInputFile] = ensureArray(inputFiles);
	if (firstInputFile == null) {
		throw new ReferenceError(`There must be at least one input file to test`);
	}

	const inputEntry = arguments.length === 3 ? (inputEntryOrOptions as TestFileEntry) : typeof firstInputFile === "string" ? firstInputFile : firstInputFile.text;
	const options =
		arguments.length === 3 ? (optionsOrUndefined as Exclude<typeof optionsOrUndefined, undefined>) : (inputEntryOrOptions as Exclude<typeof optionsOrUndefined, undefined>);

	const useCommonJs = options.environment?.preset == null || options.environment.preset === "NODE" || options.environment.preset === "NODE_CJS";
	if (options.environment?.preset == null || options.environment.preset === "NODE" || options.environment.preset === "NODE_CJS" || options.environment.preset === "NODE_ESM") {
		inputFiles = [...ensureArray(inputFiles), ...createBuiltInModuleTestFiles("child_process", "fs", "http", "path", "assert")];
	}

	const setup = createTestSetup(inputFiles, inputEntry, options);

	const {
		context,
		fileStructure: {files, dir, entry},
		compilerHost
	} = setup;

	const {typescript} = context;

	const compilerOptions: TS.CompilerOptions = {
		...typescript.getDefaultCompilerOptions(),
		allowJs: true,
		sourceMap: false,
		outDir: dir.dist,
		rootDir: dir.root,
		module: useCommonJs ? typescript.ModuleKind.CommonJS : typescript.ModuleKind.ESNext
	};

	const program = typescript.createProgram({
		rootNames: files.map(file => path.normalize(file.fileName)),
		options: compilerOptions,
		host: compilerHost
	});

	const entrySourceFile = program.getSourceFile(entry.file.fileName);
	if (entrySourceFile == null) {
		throw new ReferenceError(`No such SourceFile: '${entry.file.fileName}'`);
	}

	const entryNode = findEntryExpressionFromStatements(entrySourceFile.statements, entry.match, typescript);

	return {
		setup,
		result: evaluate({
			...context,
			node: entryNode,
			...(context.useTypeChecker
				? {
						typeChecker: program.getTypeChecker()
				  }
				: {})
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
