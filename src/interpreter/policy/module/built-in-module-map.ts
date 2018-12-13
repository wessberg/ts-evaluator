export interface IBuiltInModuleMap {
	http: typeof import("http");
	fs: typeof import("fs");
	path: typeof import("path");
}