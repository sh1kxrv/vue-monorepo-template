import type { PluginOption } from "vite";
import type { ConditionPlugin } from "../types/config";

export async function loadConditionPlugins(
  conditionPlugins: ConditionPlugin[]
) {
  const plugins: PluginOption[] = [];
  for (const conditionPlugin of conditionPlugins) {
    if (conditionPlugin.condition) {
      const realPlugins = await conditionPlugin.plugins();
      plugins.push(...realPlugins);
    }
  }
  return plugins.flat();
}
