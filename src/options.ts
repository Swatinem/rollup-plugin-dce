export interface Options {
  /**
   * All file names, and the `sourceGlob` below will be reported and resolved
   * relative to the `context`, which defaults to `process.cwd()`.
   */
  context?: string;
  /**
   * To find files which are not being imported at all, a `sourceGlob` pattern
   * can be provided that will find and report all those unused source files.
   */
  sourceGlob?: string;
}
