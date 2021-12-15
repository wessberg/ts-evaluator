export interface EvaluateIOPolicy {
	read: boolean;
	write: boolean;
}

export interface EvaluateProcessPolicy {
	exit: boolean;
	spawnChild: boolean;
}

export interface EvaluatePolicy {
	io: boolean | EvaluateIOPolicy;
	process: boolean | EvaluateProcessPolicy;
	network: boolean;
	console: boolean;
	deterministic: boolean;
	maxOps: number;
	maxOpDuration: number;
}

export interface EvaluatePolicySanitized {
	io: EvaluateIOPolicy;
	process: EvaluateProcessPolicy;
	network: boolean;
	console: boolean;
	deterministic: boolean;
	maxOps: number;
	maxOpDuration: number;
}
