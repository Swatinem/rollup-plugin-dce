import { rollup } from "rollup";
import { plugin } from "../src";
import path from "path";
import { dts } from "rollup-plugin-dts";

const TESTCASES = path.join(__dirname, "testcases");

describe("plugin", () => {
  const cwd = process.cwd();
  afterAll(() => process.chdir(cwd));

  it("works with globs", async () => {
    const dir = path.join(TESTCASES, "dead-file");
    process.chdir(dir);

    let warning;
    const bundle = await rollup({
      input: "index.js",
      plugins: [
        plugin({
          context: dir,
          sourceGlob: "*.js",
        }),
      ],
      onwarn(_warning) {
        warning = _warning;
      },
    });
    await bundle.generate({ format: "es" });

    expect(warning).toMatchInlineSnapshot(`
            Object {
              "code": "PLUGIN_WARNING",
              "message": "Found Dead Code:
            * a.js",
              "plugin": "dce",
              "toString": [Function],
            }
        `);
  });

  it("works when combined with rollup-plugin-dts", async () => {
    const dir = path.join(TESTCASES, "dts");
    process.chdir(dir);

    let warning;
    const bundle = await rollup({
      input: ["a.ts", "b.ts"],
      plugins: [
        dts(),
        plugin({
          context: dir,
        }),
      ],
      onwarn(_warning) {
        warning = _warning;
      },
    });
    await bundle.generate({ format: "es" });

    expect(warning).toMatchInlineSnapshot(`
      Object {
        "code": "PLUGIN_WARNING",
        "message": "Found Dead Code:
      * common.ts
        C",
        "plugin": "dce",
        "toString": [Function],
      }
    `);
  });
});
