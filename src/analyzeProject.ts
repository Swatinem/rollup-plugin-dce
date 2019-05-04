import { Options as PluginOptions } from "./options";
import { rollup, InputOptions } from "rollup";
import { getDeadCode, DeadCode } from "./analyze";

interface Options extends InputOptions, PluginOptions {}

export async function analyzeTSProject(options: Options): Promise<DeadCode> {
  const { context = process.cwd(), sourceGlob, ...rollupOptions } = options;
  const { ts, dts } = await import("rollup-plugin-dts");

  const inputOptions: InputOptions = {
    external(id) {
      // for now all bare imports are considered external…
      return !id.startsWith(".") && !id.startsWith("/");
    },
    ...rollupOptions,
    onwarn() {},
  };

  // run once with `ts`
  let bundle = await rollup({
    ...inputOptions,
    plugins: [ts()],
  });
  let result = await bundle.generate({ format: "es" });
  const chunks = result.output;

  // and again with `dts`
  bundle = await rollup({
    ...inputOptions,
    plugins: [dts()],
  });
  result = await bundle.generate({ format: "es" });
  chunks.push(...result.output);

  const deadCode = getDeadCode({
    context,
    sourceGlob,
    chunks,
  });

  return deadCode;
}
