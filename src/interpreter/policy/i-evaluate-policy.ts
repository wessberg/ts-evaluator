export interface IEvaluateIOPolicy {
	read: boolean;
	write: boolean;
}

export interface IEvaluateProcessPolicy {
	exit: boolean;
	spawnChild: boolean;
}

export interface IEvaluatePolicy {
	io: boolean|IEvaluateIOPolicy;
	process: boolean|IEvaluateProcessPolicy;
	network: boolean;
	console: boolean;
	deterministic: boolean;
	maxOps: number;
}

export interface IEvaluatePolicySanitized {
	io: IEvaluateIOPolicy;
	process: IEvaluateProcessPolicy;
	network: boolean;
	console: boolean;
	deterministic: boolean;
	maxOps: number;
}