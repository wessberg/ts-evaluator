import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * A Map between built-in modules (as well as 'console' and the operations that print to console
 * @type {TrapConditionMap<NodeBuiltInsAndGlobals>}
 */
export const CONSOLE_MAP: TrapConditionMap<NodeBuiltInsAndGlobals> = {
	console: {
		[PolicyTrapKind.APPLY]: true
	}
};