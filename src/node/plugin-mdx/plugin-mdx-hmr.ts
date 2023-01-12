import { MD_REGEX } from '../constants'
import { Plugin } from 'vite'
import assert from 'assert'

export function pluginMdxHmr(): Plugin {
  let viteReactPlugin: Plugin

  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve',
    configResolved(config) {
      viteReactPlugin = config.plugins.find(
        (item) => item.name === 'vite:react-babel'
      )
    },
    transform(code, id, opts) {
      if (MD_REGEX.test(id)) {
        assert(typeof viteReactPlugin.transform === 'function')

        // 获取到转换结果
        const result = viteReactPlugin.transform.call(
          this,
          code,
          id + '?.jsx',
          opts
        )

        // 热更新代码
        const selfAcceptCode = 'import.meta.hot.accept();'
        if (
          result &&
          typeof result === 'object' &&
          !result.code?.includes(selfAcceptCode)
        ) {
          // 没有则插入
          result.code += selfAcceptCode
        }
        return result
      }
    }
  }
}
