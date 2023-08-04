import path from "crosspath";
import fs from "fs";
import type {TestContext} from "./test-context.js";
import {generateRandomPath} from "../../src/interpreter/util/path/generate-random-path.js";
import {ensureArray} from "../../src/interpreter/util/array/ensure-array.js";
import type {MaybeArray} from "helpertypes";
import {CachedFs} from "./cached-fs.js";
import {requireModule} from "../../src/interpreter/util/loader/require-module.js";

export interface TestFileRecord {
	fileName: string;
	text: string;
}

export interface TestFileEntryRecord {
	fileName: string;
	match: string;
}

export interface TestFileEntryRefRecord {
	file: TestFileRecord;
	match: string;
}

export type TestFile = TestFileRecord | string;
export type TestFileEntry = TestFileEntryRecord | string;

const VIRTUAL_ROOT = "#root";
const VIRTUAL_SRC = "src";
const VIRTUAL_DIST = "dist";

const nodeTypesDir = path.dirname(requireModule.resolve("@types/node/package.json"));
const fsWorker = new CachedFs({fs});

export interface TestFileDirectories {
	root: string;
	src: string;
	dist: string;
}

export interface TestFileStructure {
	dir: TestFileDirectories;
	files: TestFileRecord[];
	entry: TestFileEntryRefRecord;
}

function stripNodePrefixFromModuleSpecifier(moduleSpecifier: string): string {
	return moduleSpecifier.startsWith("node:") ? moduleSpecifier.slice("node:".length) : moduleSpecifier;
}

export type SupportedBuiltInModuleBase = "child_process" | "fs" | "globals" | "buffer" | "dns" | "http" | "path" | "assert";
export type SuppportedBuiltInModule = SupportedBuiltInModuleBase | `node:${SupportedBuiltInModuleBase}`;
export function createBuiltInModuleTestFiles(...modules: SuppportedBuiltInModule[]): TestFile[] {
	return [
		{
			fileName: "node_modules/@types/node/package.json",
			text: `
				{
					"name": "@types/node",
					"version": "1.0.0",
					"types": "index.d.ts"
				}
			`
		},
		...modules.flatMap(module => [
			{
				fileName: "node_modules/@types/node/index.d.ts",
				text: `
					/// <reference path="./${stripNodePrefixFromModuleSpecifier(module)}.d.ts" />
					`
			},
			{
				fileName: `node_modules/@types/node/${stripNodePrefixFromModuleSpecifier(module)}.d.ts`,
				text: fsWorker.readFile(path.native.join(nodeTypesDir, `${stripNodePrefixFromModuleSpecifier(module)}.d.ts`)) ?? ""
			}
		])
	];
}

export function createTestFileStructure(input: MaybeArray<TestFile>, entryInput: TestFileEntry, context: TestContext): TestFileStructure {
	const root = path.join(context.cwd, VIRTUAL_ROOT);
	const src = path.join(root, VIRTUAL_SRC);
	const dist = path.join(root, VIRTUAL_DIST);
	const files: TestFileRecord[] = ensureArray(input)
		.map(file =>
			typeof file === "string"
				? {
						text: file,
						fileName: generateRandomPath({extension: ".ts"})
				  }
				: file
		)
		.map(file => ({...file, fileName: path.join(src, file.fileName)}));

	const entry: TestFileEntryRefRecord =
		typeof entryInput === "string"
			? {file: files[0], match: entryInput}
			: {file: files.find(file => file.fileName === path.join(src, entryInput.fileName))!, match: entryInput.match};

	return {
		dir: {
			root,
			src,
			dist
		},
		files,
		entry
	};
}
