import { OutputAsset, OutputChunk } from "rollup";
import path from "path";
import { getSourceFiles } from "./glob";

interface DeadCodeFile {
  fileName: string;
  deadExports: Array<string>;
}

export interface DeadCode {
  files: Array<DeadCodeFile>;
}

interface Module {
  renderedExports: Set<string>;
  removedExports: Set<string>;
}

interface Options {
  context: string;
  sourceGlob?: string;
  chunks: Array<OutputChunk | OutputAsset>;
}

export async function getDeadCode(options: Options): Promise<DeadCode> {
  const { context, sourceGlob, chunks } = options;
  const sourceFiles = sourceGlob ? await getSourceFiles(sourceGlob, { cwd: context }) : new Set<string>();

  const modules = new Map<string, Module>();

  for (const chunk of chunks) {
    // istanbul ignore if
    if (!chunk.code) {
      continue;
    }
    for (const [id, module] of Object.entries(chunk.modules)) {
      const existingModule = modules.get(id);
      if (existingModule) {
        for (const removedExport of module.removedExports) {
          if (!existingModule.renderedExports.has(removedExport)) {
            existingModule.removedExports.add(removedExport);
          }
        }
        for (const renderedExport of module.renderedExports) {
          existingModule.renderedExports.add(renderedExport);
          existingModule.removedExports.delete(renderedExport);
        }
      } else {
        modules.set(id, {
          renderedExports: new Set(module.renderedExports),
          removedExports: new Set(module.removedExports),
        });
      }
    }
  }

  const files: Array<DeadCodeFile> = [];

  for (const [id, module] of modules) {
    sourceFiles.delete(id);
    if (module.removedExports.size) {
      files.push({
        fileName: path.relative(context, id),
        deadExports: [...module.removedExports],
      });
    }
  }

  for (const id of sourceFiles) {
    files.push({
      fileName: path.relative(context, id),
      deadExports: [],
    });
  }

  return { files };
}
