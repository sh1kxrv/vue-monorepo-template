import type { UserConfig } from "vite";

import type { DefineApplicationOptions } from "../types/config";

import { defineConfig, loadEnv, mergeConfig } from "vite";

import { getCommonConfig } from "./common";
import { loadApplicationPlugins } from "../plugins/application";

function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
  return defineConfig(async (config) => {
    const options = await userConfigPromise?.(config);
    const { command, mode } = config;
    const { application = {}, vite = {} } = options || {};
    const root = process.cwd();
    const isBuild = command === "build";
    const env = loadEnv(mode, root);

    const plugins = await loadApplicationPlugins({
      compress: false,
      compressTypes: ["brotli", "gzip"],
      isBuild,
      mode,
      env,
      ...application,
    });

    const applicationConfig: UserConfig = {
      base: "/",
      build: {
        rollupOptions: {
          output: {
            assetFileNames: "[ext]/[name]-[hash].[ext]",
            chunkFileNames: "js/[name]-[hash].js",
            entryFileNames: "jse/index-[name]-[hash].js",
            manualChunks(id: string) {
              if (id.includes("zod") || id.includes("vee-validate")) {
                return "validation";
              } else if (id.includes("nouislider") || id.includes("swiper")) {
                return "ui";
              } else if (id.includes("node_modules")) {
                return "vendor";
              }
            },
          },
        },
        target: "es2015",
      },
      esbuild: {
        drop: isBuild ? ["debugger"] : [],
        legalComments: "none",
      },
      plugins,
      server: {
        host: true,
        port: 3000,
        warmup: {
          clientFiles: [
            "./index.html",
            "./src/{views,layouts,router,store,api,adapter}/*",
          ],
        },
      },
    };

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig
    );
    return mergeConfig(mergedCommonConfig, vite);
  });
}

export { defineApplicationConfig };
