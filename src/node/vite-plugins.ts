import { Plugin } from 'vite'
import { pluginIndexHtml } from './plugin-island/index-html'
import pluginReact from '@vitejs/plugin-react'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { pluginMdxRollup } from './plugin-mdx/plugin-mdx-rollup'

export function createVitePlugin(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root }),
    pluginMdxRollup()
  ] as Plugin[]
}
