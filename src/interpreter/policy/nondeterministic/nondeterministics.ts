import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";

/**
 * A Map between built-in identifiers and the members that produce non-deterministic results.
 * @type {TrapConditionMap<typeof global>}
 */
export const NONDETERMINISTICS: TrapConditionMap<typeof global> = {
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