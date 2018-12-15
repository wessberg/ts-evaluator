import {PolicyTrapKind} from "../policy-trap-kind";
import {TrapConditionMap} from "../trap-condition-map";
import {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals";

/**
 * A Map between built-in modules and the kind of IO operations their members performs
 * @type {TrapConditionMap<NodeBuiltInsAndGlobals>}
 */
export const NETWORK_MAP: TrapConditionMap<NodeBuiltInsAndGlobals> = {
	http2: {
		connect: {
			[PolicyTrapKind.APPLY]: true
		},
		createSecureServer: {
			[PolicyTrapKind.APPLY]: true
		},
		createServer: {
			[PolicyTrapKind.APPLY]: true
		}
	},

	https: {
		createServer: {
			[PolicyTrapKind.APPLY]: true
		},
		request: {
			[PolicyTrapKind.APPLY]: true
		},
		get: {
			[PolicyTrapKind.APPLY]: true
		},
		Server: {
			[PolicyTrapKind.CONSTRUCT]: true
		},
		globalAgent: {
			destroy: {
				[PolicyTrapKind.APPLY]: true
			}
		},
		Agent: {
			[PolicyTrapKind.CONSTRUCT]: true
		}
	},

	http: {
		createClient: {
			[PolicyTrapKind.APPLY]: true
		},
		createServer: {
			[PolicyTrapKind.APPLY]: true
		},
		request: {
			[PolicyTrapKind.APPLY]: true
		},
		get: {
			[PolicyTrapKind.APPLY]: true
		},
		Server: {
			[PolicyTrapKind.CONSTRUCT]: true
		},
		ClientRequest: {
			[PolicyTrapKind.CONSTRUCT]: true
		},
		globalAgent: {
			destroy: {
				[PolicyTrapKind.APPLY]: true
			}
		},
		Agent: {
			[PolicyTrapKind.CONSTRUCT]: true
		}
	},

	dgram: {
		createSocket: {
			[PolicyTrapKind.APPLY]: true
		}
	},
	dns: {
		lookup: {
			[PolicyTrapKind.APPLY]: true
		},
		lookupService: {
			[PolicyTrapKind.APPLY]: true
		},
		resolve: {
			[PolicyTrapKind.APPLY]: true
		},
		resolve4: {
			[PolicyTrapKind.APPLY]: true
		},
		resolve6: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveAny: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveCname: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveMx: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveNaptr: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveNs: {
			[PolicyTrapKind.APPLY]: true
		},
		resolvePtr: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveSoa: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveSrv: {
			[PolicyTrapKind.APPLY]: true
		},
		resolveTxt: {
			[PolicyTrapKind.APPLY]: true
		},
		reverse: {
			[PolicyTrapKind.APPLY]: true
		},
		Resolver: {
			[PolicyTrapKind.CONSTRUCT]: true
		}
	},
	net: {
		createServer: {
			[PolicyTrapKind.APPLY]: true
		},
		createConnection: {
			[PolicyTrapKind.APPLY]: true
		},
		connect: {
			[PolicyTrapKind.APPLY]: true
		},
		Server: {
			[PolicyTrapKind.CONSTRUCT]: true
		}
	},
	tls: {
		createServer: {
			[PolicyTrapKind.APPLY]: true
		},
		createSecureContext: {
			[PolicyTrapKind.APPLY]: true
		},
		connect: {
			[PolicyTrapKind.APPLY]: true
		},
		Server: {
			[PolicyTrapKind.CONSTRUCT]: true
		},
		TLSSocket: {
			[PolicyTrapKind.CONSTRUCT]: true
		}
	}
};