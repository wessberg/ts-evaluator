/* eslint-disable @typescript-eslint/naming-convention */
import {PolicyTrapKind} from "../policy-trap-kind.js";
import {TrapConditionMap} from "../trap-condition-map.js";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * A Map between built-in modules (as well as 'console' and the operations that print to console
 */
export const CONSOLE_MAP: TrapConditionMap<NodeBuiltInsAndGlobals> = {
	"node:console": "console",
	console: {
		[PolicyTrapKind.APPLY]: true
	}
};
