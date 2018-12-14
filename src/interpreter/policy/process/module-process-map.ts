import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {IBuiltInModuleMap} from "../module/built-in-module-map";
import {IEvaluateProcessPolicy} from "../i-evaluate-policy";
import {spawn} from "child_process";
spawn("ls");

/**
 * A Map between built-in modules (as well as 'process' and the kind of IO operations their members performs
 * @type {TrapConditionMap<IBuiltInModuleMap>}
 */
export const MODULE_PROCESS_MAP: TrapConditionMap<IBuiltInModuleMap & {process: typeof process}, keyof IEvaluateProcessPolicy> = {
	process: {
		exit: {
			[PolicyTrapKind.APPLY]: "exit"
		}
	},
	// Everything inside child_process is just one big violation of this policy
	child_process: {
		[PolicyTrapKind.APPLY]: "spawnChild"
	}
};