import { ts, dts } from "rollup-plugin-dts";
import pkg from "./package.json";

const external = ["rollup", "glob", "rollup-plugin-dts", "path"];

/**
 * @type {Array<import("rollup").RollupWatchOptions>}
 */
const config = [
  {
    input: "./src/index.ts",
    output: [{ exports: "named", file: pkg.main, format: "cjs" }, { file: pkg.module, format: "es" }],

    external,
    treeshake: {
      pureExternalModules: true,
    },

    plugins: [ts()],
  },
  {
    input: "./src/index.ts",
    output: [{ file: pkg.types, format: "es" }],

    external,

    plugins: [dts()],
  },
];

export default config;
