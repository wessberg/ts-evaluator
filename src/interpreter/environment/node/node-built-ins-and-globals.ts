import {BuiltInModuleMap} from "../../policy/module/built-in-module-map";

export type NodeBuiltInsAndGlobals = BuiltInModuleMap & typeof global;
