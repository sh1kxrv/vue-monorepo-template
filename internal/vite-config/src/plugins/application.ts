import type { PluginOption } from 'vite'

import type { ApplicationPluginOptions } from '../types/config'

import viteCompressPlugin from 'vite-plugin-compression'

import { loadConditionPlugins } from '.'
import { loadCommonPlugins } from './common'
import { useIsolatedAlias } from './plugin/vite.isolated-alias'
import tailwindcss from '@tailwindcss/vite'

export async function loadApplicationPlugins(
  options: ApplicationPluginOptions,
): Promise<PluginOption[]> {
  const isBuild = options.isBuild

  const { compress, compressTypes, ...commonOptions } = options

  const commonPlugins = await loadCommonPlugins(commonOptions)

  return await loadConditionPlugins([
    ...commonPlugins,
    {
      condition: true,
      plugins: () => [useIsolatedAlias(), tailwindcss()],
    },
    {
      condition: isBuild && !!compress,
      plugins: () => {
        const compressPlugins: PluginOption[] = []
        if (compressTypes?.includes('brotli')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.br' }),
          )
        }
        if (compressTypes?.includes('gzip')) {
          compressPlugins.push(
            viteCompressPlugin({ deleteOriginFile: false, ext: '.gz' }),
          )
        }
        return compressPlugins
      },
    },
  ])
}
