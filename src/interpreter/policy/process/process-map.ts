/* eslint-disable @typescript-eslint/naming-convention */
import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {EvaluateProcessPolicy} from "../evaluate-policy";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * A Map between built-in modules (as well as 'process' and the kind of IO operations their members performs
 */
export const PROCESS_MAP: TrapConditionMap<NodeBuiltInsAndGlobals, keyof EvaluateProcessPolicy> = {
	"node:process": "process",
	process: {
		exit: {
			[PolicyTrapKind.APPLY]: "exit"
		}
	},
	
	// Everything inside child_process is just one big violation of this policy
	"node:child_process": "child_process",
	child_process: {
		[PolicyTrapKind.APPLY]: "spawnChild"
	},
	
	"node:cluster": "cluster",
	cluster: {
		Worker: {
			[PolicyTrapKind.CONSTRUCT]: "spawnChild"
		}
	}	
};