import { Plugin } from 'vite'
import { pluginIndexHtml } from './plugin-island/index-html'
import pluginReact from '@vitejs/plugin-react'
import pluginUnocss from 'unocss/vite'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'
import { SiteConfig } from 'shared/types'
import { createPluginMdx } from './plugin-mdx'
import unocssOptions from './unocss-options'

export async function createVitePlugin(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restartServer),
    pluginRoutes({ root: config.root, isSSR }),
    await createPluginMdx()
  ] as Plugin[]
}
