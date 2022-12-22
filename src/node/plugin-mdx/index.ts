import { pluginMdxRollup } from './plugin-mdx-rollup'

export function createPluginMdx() {
  return [pluginMdxRollup()]
}
