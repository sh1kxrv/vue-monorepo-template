import type { UserConfig } from "vite";

export function getCommonConfig(): UserConfig {
  return {
    build: {
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      sourcemap: false,
    },
  };
}
