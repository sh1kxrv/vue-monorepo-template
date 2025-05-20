import type { PluginOption } from "vite";
import type { LibraryPluginOptions } from "../types/config";
import { loadConditionPlugins } from ".";
import viteDts from "vite-plugin-dts";
import { loadCommonPlugins } from "./common";

export async function loadLibraryPlugins(
  options: LibraryPluginOptions
): Promise<PluginOption[]> {
  const isBuild = options.isBuild;
  const { dts, ...commonOptions } = options;
  const commonPlugins = await loadCommonPlugins(commonOptions);
  return await loadConditionPlugins([
    ...commonPlugins,
    {
      condition: isBuild && !!dts,
      plugins: () => [viteDts({ logLevel: "error" })],
    },
  ]);
}
