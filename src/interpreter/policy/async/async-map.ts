import {TrapConditionMap} from "../trap-condition-map";
import {IEvaluateAsyncPolicy} from "../i-evaluate-policy";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";
import {PolicyTrapKind} from "../policy-trap-kind";

const GLOBAL_TIMERS_ASYNC_MAP: TrapConditionMap<BuiltInsAndGlobals, keyof IEvaluateAsyncPolicy> = {
	setImmediate: {
		[PolicyTrapKind.APPLY]: "timer"
	},
	setInterval: {
		[PolicyTrapKind.APPLY]: "timer"
	},
	setTimeout: {
		[PolicyTrapKind.APPLY]: "timer"
	},
	clearImmediate: {
		[PolicyTrapKind.APPLY]: "timer"
	},
	clearInterval: {
		[PolicyTrapKind.APPLY]: "timer"
	},
	clearTimeout: {
		[PolicyTrapKind.APPLY]: "timer"
	}
};

/**
 * A Map between built-in modules and globals, and the members that are asynchronous
 * @type {TrapConditionMap<BuiltInsAndGlobals, string>}
 */
export const ASYNC_MAP: TrapConditionMap<BuiltInsAndGlobals, keyof IEvaluateAsyncPolicy> = {
	...GLOBAL_TIMERS_ASYNC_MAP,
	timers: {
		...GLOBAL_TIMERS_ASYNC_MAP
	}
};