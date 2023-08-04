/* eslint-disable @typescript-eslint/naming-convention */
import {PolicyTrapKind} from "../policy-trap-kind.js";
import type {TrapConditionMap} from "../trap-condition-map.js";
import {NETWORK_MAP} from "../network/network-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * A Map between built-in identifiers and the members that produce non-deterministic results.
 */
export const NONDETERMINISTIC_MAP: TrapConditionMap<NodeBuiltInsAndGlobals> = {
	// Any network operation will always be non-deterministic
	...NETWORK_MAP,
	Math: {
		random: {
			[PolicyTrapKind.APPLY]: true
		}
	},
	Date: {
		now: {
			[PolicyTrapKind.APPLY]: true
		},
		// Dates that receive no arguments are nondeterministic since they care about "now" and will evaluate to a new value for each invocation
		[PolicyTrapKind.CONSTRUCT]: (...args) => args.length === 0 && !(args[0] instanceof Date)
	}
};
