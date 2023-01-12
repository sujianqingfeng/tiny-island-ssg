import { pluginMdxHmr } from './plugin-mdx-hmr'
import { pluginMdxRollup } from './plugin-mdx-rollup'

export async function createPluginMdx() {
  return [await pluginMdxRollup(), pluginMdxHmr()]
}
