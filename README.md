# rollup-plugin-dce

[![Build Status](https://img.shields.io/travis/Swatinem/rollup-plugin-dce.svg)](https://travis-ci.org/Swatinem/rollup-plugin-dce)
[![Coverage Status](https://img.shields.io/codecov/c/github/Swatinem/rollup-plugin-dce.svg)](https://codecov.io/gh/Swatinem/rollup-plugin-dce)

## Usage

Install the package from `npm`:

    $ npm install --save-dev rollup rollup-plugin-dce

Add it to your `rollup.config.js`:

```js
import dce from "rollup-plugin-dce";

const config = [
  {
    input: "./src/index.ts",
    output: [{ file: "dist/my-library.js", format: "cjs" }, { file: "dist/my-library.mjs", format: "es" }],

    plugins: [
      ts(),
      dce({
        sourceGlob: "./src/**/*.ts",
      }),
    ],
  },
];

export default config;
```

## TypeScript support

For TypeScript projects, this plugin integrates with
[rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts)
and can report dead non-emit items, such as `interface` and `type` declarations.

As this requires two passes, one for the transpiled `.js` code, and another for
the type definitions of `.d.ts` files, using this plugin as part of a
`rollup.config` can lead to false positives.

For this reason, it is recommended to programmatically analyze a TypeScript
project like so:

```ts
import { analyzeTSProject } from "rollup-plugin-dce";

const { files: filesWithDeadCode } = await analyzeTSProject({
  input: "./src/index.ts",
  sourceGlob: "./src/**/*.ts",
});
```
