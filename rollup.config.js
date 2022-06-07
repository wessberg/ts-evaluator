import ts from "rollup-plugin-ts";
import pkg from "./package.json";
import {builtinModules} from "module";

const SHARED_OUTPUT_OPTIONS = {
	sourcemap: true,
	hoistTransitiveImports: false,
	generatedCode: "es2015",
	compact: false,
	minifyInternalExports: false
};

// noinspection JSUnusedGlobalSymbols
export default {
	input: "src/index.ts",
	output: [
		{
			file: pkg.exports.require,
			format: "cjs",
			...SHARED_OUTPUT_OPTIONS
		},
		{
			file: pkg.exports.import,
			format: "esm",
			...SHARED_OUTPUT_OPTIONS
		}
	],
	treeshake: true,
	plugins: [
		ts({
			tsconfig: "tsconfig.build.json"
		})
	],
	external: [...builtinModules, ...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)]
};
