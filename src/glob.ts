import glob from "glob";
import path from "path";

export async function getSourceFiles(pattern: string, options: glob.IOptions) {
  const files: Array<string> = await new Promise((resolve, reject) => {
    glob(pattern, options, (error, matches) => {
      // istanbul ignore if
      if (error) {
        return reject(error);
      }
      resolve(matches);
    });
  });
  return new Set(files.map(f => path.join(options.cwd!, f)));
}
