import { InputOption } from "rollup";
import { analyzeTSProject } from "../src";
import path from "path";
import fsExtra from "fs-extra";

const TESTCASES = path.join(__dirname, "testcases");

interface Meta {
  skip: boolean;
  cwd: string;
  input: InputOption;
  sourceGlob: string;
}

describe("testcases", () => {
  const cwd = process.cwd();
  afterAll(() => process.chdir(cwd));

  const dirs = fsExtra.readdirSync(TESTCASES);
  for (const name of dirs) {
    const dir = path.join(TESTCASES, name);

    if (fsExtra.statSync(dir).isDirectory()) {
      const config: Meta = {
        cwd: dir,
        skip: false,
        input: "index.js",
        sourceGlob: "!(config).{ts,js}",
      };

      try {
        const configFile = require(path.join(dir, "config"));
        Object.assign(config, configFile.default || configFile);
      } catch {}

      const testfn = config.skip ? it.skip : it;

      testfn(`works for testcase "${name}"`, async () => {
        process.chdir(config.cwd);

        await expect(
          analyzeTSProject({
            input: config.input,
            sourceGlob: config.sourceGlob,
          }),
        ).resolves.toMatchSnapshot();
      });
    }
  }
});
