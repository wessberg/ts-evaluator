import {PolicyTrapKind} from "./policy-trap-kind";

export type TrapConditionFunction<ConditionType> = (...args: unknown[]) => ConditionType;
export type TrapCondition<ConditionType> = ConditionType|TrapConditionFunction<ConditionType>;

export type PolicyTrapKindToTrapConditionMap<ConditionType> = {
	[key in PolicyTrapKind]?: TrapCondition<ConditionType>;
};

export type TrapConditionMap<T, ConditionType = boolean> = {
	[Key in keyof T]?: TrapConditionMapValue<T[Key], ConditionType>;
};

export type TrapConditionMemberMap<T, ConditionType> = {
	[Key in keyof T]?: TrapConditionMapValue<T[Key], ConditionType>;
};

export type TrapConditionMapValue<T, ConditionType> = TrapCondition<ConditionType>|TrapConditionMemberMap<T, ConditionType>|PolicyTrapKindToTrapConditionMap<ConditionType>|undefined;

/**
 * Returns true if the given item is a TrapCondition
 * @param {TrapConditionMapValue<T>>} item
 * @param {ConditionType} condition
 * @return {item is TrapCondition}
 */
export function isTrapCondition<ConditionType> (item: unknown, condition: ConditionType): item is TrapCondition<ConditionType> {
	// noinspection SuspiciousTypeOfGuard
	return typeof item === (typeof condition) || typeof item === "function";
}

/**
 * Returns true if the given item is a TrapCondition
 * @param {TrapConditionMapValue<T>>} item
 * @return {item is TrapCondition}
 */
export function isTrapConditionFunction<T, ConditionType = boolean> (item: TrapConditionMapValue<T, ConditionType>): item is TrapConditionFunction<ConditionType> {
	return typeof item === "function";
}