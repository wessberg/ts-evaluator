/* eslint-disable @typescript-eslint/naming-convention */
import {PolicyTrapKind} from "../policy-trap-kind.js";
import type {TrapConditionMap} from "../trap-condition-map.js";
import type {NodeBuiltInsAndGlobals} from "../../environment/node/node-built-ins-and-globals.js";

/**
 * A Map between built-in modules and the kind of IO operations their members performs
 * @type {TrapConditionMap<NodeBuiltInsAndGlobals>}
 */
export const NETWORK_MAP: TrapConditionMap<NodeBuiltInsAndGlobals> = {
	"node:http2": "http2",
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

	"node:https": "https",

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

	"node:http": "http",

	http: {
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

	"node:dgram": "dgram",

	dgram: {
		createSocket: {
			[PolicyTrapKind.APPLY]: true
		}
	},

	"node:dns": "dns",

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

	"node:net": "net",

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

	"node:tls": "tls",

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
