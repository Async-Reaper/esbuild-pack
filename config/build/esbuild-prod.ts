import ESBuildConfig from "esbuild";
import path from "path";
import config from "./esbuild-config";

ESBuildConfig.build(config).catch(console.log);
