import { existsSync } from "node:fs";
import { join } from "node:path";
import { ProjectType } from "../types";
import type { DefineConfig } from "../types/config";
import { defineApplicationConfig } from "./application";
import { defineLibraryConfig } from "./library";

function defineConfig(
  userConfigPromise?: DefineConfig,
  type: ProjectType = ProjectType.Detect
) {
  let projectType = type;

  if (projectType === "detect") {
    const htmlPath = join(process.cwd(), "index.html");
    projectType = existsSync(htmlPath)
      ? ProjectType.Application
      : ProjectType.Library;
  }

  switch (projectType) {
    case ProjectType.Application: {
      return defineApplicationConfig(userConfigPromise);
    }
    case ProjectType.Library: {
      return defineLibraryConfig(userConfigPromise);
    }
    default: {
      throw new Error(`Unsupported project type: ${projectType}`);
    }
  }
}

export { defineConfig };
