import * as fs from "fs";

export type ReadonlyFileSystem = Pick<typeof fs, "statSync" | "lstatSync" | "readFileSync" | "readdirSync">;

export interface SafeReadonlyFileSystem extends ReadonlyFileSystem {
	safeStatSync: (path: string) => fs.Stats | undefined;
	safeReadFileSync: (path: string) => Buffer | undefined;
}

export type FileSystem = ReadonlyFileSystem & Pick<typeof fs, "writeFileSync" | "mkdirSync">;
export type SafeFileSystem = SafeReadonlyFileSystem & Pick<typeof fs, "writeFileSync" | "mkdirSync">;
