import { analyzeTSProject } from "../src";

it("does not include dead code itself", async () => {
  await expect(
    analyzeTSProject({
      input: "./src/index.ts",
      sourceGlob: "./src/**/*.ts",
    }),
  ).resolves.toMatchObject({
    files: [],
  });
});
