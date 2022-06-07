import {BuiltInModuleMap} from "../../policy/module/built-in-module-map.js";

export type NodeBuiltInsAndGlobals = BuiltInModuleMap & typeof global;
