export interface IEvaluateIOPolicy {
	read: boolean;
	write: boolean;
}

export interface IEvaluatePolicy {
	io: boolean|IEvaluateIOPolicy;
	network: boolean;
	deterministic: boolean;
	maxOps: number;
}

export interface IEvaluatePolicySanitized {
	io: IEvaluateIOPolicy;
	network: boolean;
	deterministic: boolean;
	maxOps: number;
}