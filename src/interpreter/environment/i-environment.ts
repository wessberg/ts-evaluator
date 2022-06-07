import {EnvironmentPresetKind} from "./environment-preset-kind.js";
import {LexicalEnvironment} from "../lexical-environment/lexical-environment.js";

export interface IEnvironment {
	preset: EnvironmentPresetKind;
	extra: LexicalEnvironment["env"];
}
