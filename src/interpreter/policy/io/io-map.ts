import {TrapConditionMap} from "../trap-condition-map";
import {PolicyTrapKind} from "../policy-trap-kind";
import {EvaluateIOPolicy} from "../evaluate-policy";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * A Map between built-in modules and the kind of IO operations their members performs
 * @type {TrapConditionMap<NodeBuiltInsAndGlobals, "read"|"write">}
 */
export const IO_MAP: TrapConditionMap<NodeBuiltInsAndGlobals, keyof EvaluateIOPolicy> = {
	"node:fs": "fs",
	fs: {
		readFile: {
			[PolicyTrapKind.APPLY]: "read"
		},
		readFileSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		readdir: {
			[PolicyTrapKind.APPLY]: "read"
		},
		readdirSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		read: {
			[PolicyTrapKind.APPLY]: "read"
		},
		readSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		exists: {
			[PolicyTrapKind.APPLY]: "read"
		},
		existsSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		access: {
			[PolicyTrapKind.APPLY]: "read"
		},
		accessSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		close: {
			[PolicyTrapKind.APPLY]: "read"
		},
		closeSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		createReadStream: {
			[PolicyTrapKind.APPLY]: "read"
		},
		stat: {
			[PolicyTrapKind.APPLY]: "read"
		},
		statSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		watch: {
			[PolicyTrapKind.APPLY]: "read"
		},
		watchFile: {
			[PolicyTrapKind.APPLY]: "read"
		},
		unwatchFile: {
			[PolicyTrapKind.APPLY]: "read"
		},
		realpath: {
			[PolicyTrapKind.APPLY]: "read"
		},
		realpathSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		fstat: {
			[PolicyTrapKind.APPLY]: "read"
		},
		fstatSync: {
			[PolicyTrapKind.APPLY]: "read"
		},
		createWriteStream: {
			[PolicyTrapKind.APPLY]: "write"
		},
		copyFile: {
			[PolicyTrapKind.APPLY]: "write"
		},
		copyFileSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		unlink: {
			[PolicyTrapKind.APPLY]: "write"
		},
		unlinkSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		rmdir: {
			[PolicyTrapKind.APPLY]: "write"
		},
		rmdirSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		symlink: {
			[PolicyTrapKind.APPLY]: "write"
		},
		symlinkSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		truncate: {
			[PolicyTrapKind.APPLY]: "write"
		},
		truncateSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		utimes: {
			[PolicyTrapKind.APPLY]: "write"
		},
		utimesSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		appendFile: {
			[PolicyTrapKind.APPLY]: "write"
		},
		appendFileSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		write: {
			[PolicyTrapKind.APPLY]: "write"
		},
		writeSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		writeFile: {
			[PolicyTrapKind.APPLY]: "write"
		},
		writeFileSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		chmod: {
			[PolicyTrapKind.APPLY]: "write"
		},
		chmodSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		chown: {
			[PolicyTrapKind.APPLY]: "write"
		},
		chownSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		mkdir: {
			[PolicyTrapKind.APPLY]: "write"
		},
		mkdirSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		rename: {
			[PolicyTrapKind.APPLY]: "write"
		},
		renameSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		futimes: {
			[PolicyTrapKind.APPLY]: "write"
		},
		futimesSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		link: {
			[PolicyTrapKind.APPLY]: "write"
		},
		linkSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		mkdtemp: {
			[PolicyTrapKind.APPLY]: "write"
		},
		open: {
			[PolicyTrapKind.APPLY]: "write"
		},
		openSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fchmod: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fchmodSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fchown: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fchownSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		ftruncate: {
			[PolicyTrapKind.APPLY]: "write"
		},
		ftruncateSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fsync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fsyncSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fdatasync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		fdatasyncSync: {
			[PolicyTrapKind.APPLY]: "write"
		},
		lchmod: {
			[PolicyTrapKind.APPLY]: "write"
		},
		lchmodSync: {
			[PolicyTrapKind.APPLY]: "write"
		}
	}
};
