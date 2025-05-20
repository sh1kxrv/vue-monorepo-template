import type { PluginVisualizerOptions } from "rollup-plugin-visualizer";
import type { ConfigEnv, PluginOption, UserConfig } from "vite";
import type { PluginOptions } from "vite-plugin-dts";

interface CommonPluginOptions {
  env?: Record<string, any>;
  injectMetadata?: boolean;
  isBuild?: boolean;
  mode?: string;
  visualizer?: boolean | PluginVisualizerOptions;
}

interface ApplicationPluginOptions extends CommonPluginOptions {
  compress?: boolean;
  compressTypes?: ("brotli" | "gzip")[];
  injectGlobalScss?: boolean;
}

interface LibraryPluginOptions extends CommonPluginOptions {
  dts?: boolean | PluginOptions;
}

type ApplicationOptions = ApplicationPluginOptions;

type LibraryOptions = LibraryPluginOptions;

type DefineApplicationOptions = (config?: ConfigEnv) => Promise<{
  application?: ApplicationOptions;
  vite?: UserConfig;
}>;

type DefineLibraryOptions = (config?: ConfigEnv) => Promise<{
  library?: LibraryOptions;
  vite?: UserConfig;
}>;

interface ConditionPlugin {
  condition?: boolean;
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>;
}

type DefineConfig = DefineApplicationOptions | DefineLibraryOptions;

export type {
  ConditionPlugin,
  ApplicationPluginOptions,
  CommonPluginOptions,
  DefineApplicationOptions,
  DefineConfig,
  DefineLibraryOptions,
  LibraryPluginOptions,
};
