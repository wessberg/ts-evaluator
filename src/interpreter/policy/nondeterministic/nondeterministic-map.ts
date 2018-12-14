import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {NETWORK_MAP} from "../network/network-map";
import {BuiltInsAndGlobals} from "../../environment/built-in/built-ins-and-globals";

/**
 * A Map between built-in identifiers and the members that produce non-deterministic results.
 * @type {TrapConditionMap<BuiltInsAndGlobals>}
 */
export const NONDETERMINISTIC_MAP: TrapConditionMap<BuiltInsAndGlobals> = {
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