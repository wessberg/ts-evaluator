import ts from "@wessberg/rollup-plugin-ts";
import packageJSON from "./package.json";

// noinspection JSUnusedGlobalSymbols
export default {
	input: "src/index.ts",
	output: [
		{
			file: packageJSON.main,
			format: "cjs",
			sourcemap: true
		},
		{
			file: packageJSON.module,
			format: "esm",
			sourcemap: true
		}
	],
	treeshake: true,
	plugins: [
		ts({
			tsconfig: "tsconfig.build.json"
		})
	],
	external: [
		...Object.keys(packageJSON.dependencies),
		...Object.keys(packageJSON.devDependencies),
		"util", "path"
	]
};