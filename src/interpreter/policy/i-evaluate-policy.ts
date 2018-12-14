export interface IEvaluateIOPolicy {
	read: boolean;
	write: boolean;
}

export interface IEvaluateProcessPolicy {
	exit: boolean;
	spawnChild: boolean;
}

export interface IEvaluateAsyncPolicy {
	timer: boolean;
	promise: boolean;
}

export interface IEvaluatePolicy {
	io: boolean|IEvaluateIOPolicy;
	process: boolean|IEvaluateProcessPolicy;
	async: boolean|IEvaluateAsyncPolicy;
	network: boolean;
	deterministic: boolean;
	maxOps: number;
}

export interface IEvaluatePolicySanitized {
	io: IEvaluateIOPolicy;
	process: IEvaluateProcessPolicy;
	async: IEvaluateAsyncPolicy;
	network: boolean;
	deterministic: boolean;
	maxOps: number;
}