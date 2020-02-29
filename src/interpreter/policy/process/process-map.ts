import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {IEvaluateProcessPolicy} from "../i-evaluate-policy";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * A Map between built-in modules (as well as 'process' and the kind of IO operations their members performs
 * @type {TrapConditionMap<NodeBuiltInsAndGlobals, string>}
 */
export const PROCESS_MAP: TrapConditionMap<NodeBuiltInsAndGlobals, keyof IEvaluateProcessPolicy> = {
	process: {
		exit: {
			[PolicyTrapKind.APPLY]: "exit"
		}
	},
	// Everything inside child_process is just one big violation of this policy
	child_process: {
		[PolicyTrapKind.APPLY]: "spawnChild"
	},
	cluster: {
		fork: {
			[PolicyTrapKind.APPLY]: "spawnChild"
		},
		worker: {
			[PolicyTrapKind.GET]: "spawnChild"
		},
		Worker: {
			[PolicyTrapKind.CONSTRUCT]: "spawnChild"
		},
		workers: {
			[PolicyTrapKind.GET]: "spawnChild"
		}
	}
};
