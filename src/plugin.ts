import { PluginImpl } from "rollup";
import { getDeadCode } from "./analyze";
import { Options } from "./options";

export const plugin: PluginImpl<Options> = (options = {}) => {
  return {
    name: "dce",
    async generateBundle(_options, bundle) {
      const { context = process.cwd(), sourceGlob } = options;

      const { files } = await getDeadCode({ context, sourceGlob, chunks: Object.values(bundle) });
      if (files.length) {
        let formattedError = `Found Dead Code:\n`;
        formattedError += files.map(
          ({ fileName, deadExports }) => `* ${fileName}${deadExports.length ? `\n  ${deadExports.join(", ")}` : ""}`,
        );
        this.warn(formattedError);
      }
    },
  };
};
