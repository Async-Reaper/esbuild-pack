import ESBuildConfig, { BuildOptions } from "esbuild";
import path from "path";
import { cleanPlugin } from "./plugins/cleanPlugin";
import { HTMLPlugin } from "./plugins/HTMLPlugin";

const mode = process.env.MODE || "development";
const isDev = mode === "development";
const isProd = mode === "production";

function resolveRoot(...segments: string[]) {
  return path.resolve(__dirname, "..", "..", ...segments);
}

const config: BuildOptions = {
  outdir: resolveRoot("build"),
  entryPoints: [resolveRoot("src", "index.jsx")],
  entryNames: "[dir]/bundle.[name]-[hash]",
  bundle: true,
  tsconfig: resolveRoot("tsconfig.json"),
  minify: isProd,
  sourcemap: isDev,
  metafile: true,
  loader: {
    ".jpg": "file",
    ".svg": "file",
    ".png": "file",
  },
  plugins: [
    cleanPlugin,
    HTMLPlugin({
      title: "First",
      jsPath: ["index.js"],
    }),
  ],
  watch: isDev && {
    onRebuild(error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log("Build success");
      }
    },
  },
};

export default config;
