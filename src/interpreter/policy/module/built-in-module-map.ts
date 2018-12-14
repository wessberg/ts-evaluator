export interface IBuiltInModuleMap {
	async_hooks: typeof import("async_hooks");
	assert: typeof import("assert");
	buffer: typeof import("buffer");
	child_process: typeof import("child_process");
	http: typeof import("http");
	https: typeof import("https");
	http2: typeof import("http2");
	fs: typeof import("fs");
	path: typeof import("path");
}