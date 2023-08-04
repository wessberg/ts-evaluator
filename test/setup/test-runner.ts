import path from "crosspath";
import fs from "fs";
import semver from "semver";
import avaTest, {type ExecutionContext} from "ava";
import type * as TS from "typescript";

function getNearestPackageJson(from = import.meta.url): Record<string, unknown> | undefined {
	// There may be a file protocol in from of the path
	const normalizedFrom = path.urlToFilename(from);
	const currentDir = path.dirname(normalizedFrom);

	const pkgPath = path.join(currentDir, "package.json");
	if (fs.existsSync(pkgPath)) {
		return JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
	} else if (currentDir !== normalizedFrom) {
		return getNearestPackageJson(currentDir);
	} else {
		return undefined;
	}
}

const pkg = getNearestPackageJson();

export interface ExecutionContextOptions {
	typescript: typeof TS;
	useTypeChecker: boolean;
}

export type ExtendedImplementation = (t: ExecutionContext, options: ExecutionContextOptions) => void | Promise<void>;

const {devDependencies} = pkg as {devDependencies: Record<string, string>};

// Map of all TypeScript versions parsed from package.json
const TS_OPTIONS_ENTRIES = new Map<string, Omit<ExecutionContextOptions, "useTypeChecker">>();

const tsRangeRegex = /(npm:typescript@)?[\^~]*(.+)$/;

const tsFilter = process.env.TS_VERSION;

for (const [specifier, range] of Object.entries(devDependencies)) {
	const tsMatch = range.match(tsRangeRegex);

	const tsMatchContext = tsMatch?.[1];
	const tsMatchVersion = tsMatch?.[2];

	if (tsMatchVersion != null && (tsMatchContext === "npm:typescript@" || specifier === "typescript")) {
		if (tsFilter === undefined || (tsFilter.toUpperCase() === "CURRENT" && specifier === "typescript") || semver.satisfies(tsMatchVersion, tsFilter, {includePrerelease: true})) {
			TS_OPTIONS_ENTRIES.set(tsMatchVersion, {
				typescript: (await import(specifier)).default
			});
		}
	}
}

if (TS_OPTIONS_ENTRIES.size === 0) {
	throw new Error(`The TS_VERSION environment variable matches none of the available TypeScript versions.
Filter: ${process.env.TS_VERSION}
Available TypeScript versions: ${[...TS_OPTIONS_ENTRIES.keys()].join(", ")}`);
}

interface TestRunOptions {
	only: boolean;
	serial: boolean;
	skip: boolean;
}

export function test(title: string, tsVersionGlob: string | undefined, impl: ExtendedImplementation, runOptions?: Partial<TestRunOptions>) {
	const allOptions = [...TS_OPTIONS_ENTRIES.values()];
	const filteredOptions =
		tsVersionGlob == null || tsVersionGlob === "*"
			? allOptions
			: [...TS_OPTIONS_ENTRIES.entries()].filter(([version]) => semver.satisfies(version, tsVersionGlob, {includePrerelease: true})).map(([, options]) => options);

	for (const useTypeChecker of [true, false]) {
		for (const currentOptions of allOptions) {
			const matchesGlob = filteredOptions.includes(currentOptions);
			const fullTitle = `${title} (TypeScript v${currentOptions.typescript.version}${matchesGlob ? "" : " is not applicable"}) (Use TypeChecker: ${useTypeChecker})`;

			const testHandler = async (t: ExecutionContext) => (matchesGlob ? impl(t, {...currentOptions, useTypeChecker}) : t.pass());

			if (Boolean(runOptions?.only)) {
				avaTest.only(fullTitle, testHandler);
			} else if (Boolean(runOptions?.serial)) {
				avaTest.serial(fullTitle, testHandler);
			} else if (Boolean(runOptions?.skip)) {
				avaTest.skip(fullTitle, testHandler);
			} else {
				avaTest(fullTitle, testHandler);
			}
		}
	}
}

test.only = function (title: string, tsVersionGlob: string | undefined, impl: ExtendedImplementation) {
	return test(title, tsVersionGlob, impl, {only: true});
};

test.serial = function (title: string, tsVersionGlob: string | undefined, impl: ExtendedImplementation) {
	return test(title, tsVersionGlob, impl, {serial: true});
};

test.skip = function (title: string, tsVersionGlob: string | undefined, impl: ExtendedImplementation) {
	return test(title, tsVersionGlob, impl, {skip: true});
};
