import { defineConfig } from '@mono/vite-config'

export default defineConfig(async () => {
  return {
    application: {
      compress: true,
      visualizer: true,
      isBuild: true,
    },
    vite: {},
  }
})
