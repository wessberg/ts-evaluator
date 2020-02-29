import {EnvironmentPresetKind} from "./environment-preset-kind";
import {LexicalEnvironment} from "../lexical-environment/lexical-environment";

export interface IEnvironment {
	preset: EnvironmentPresetKind;
	extra: LexicalEnvironment["env"];
}
