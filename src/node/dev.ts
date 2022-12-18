import { createServer as createViteDevServer } from 'vite'
import { pluginIndexHtml } from './plugin-island/index-html'
import pluginReact from '@vitejs/plugin-react'
import { PACKAGE_ROOT } from './constants'
import { resolveConfig } from './config'
import { pluginConfig } from './plugin-island/config'
import { pluginRoutes } from './plugin-routes'

export async function createDevServer(
  root = process.cwd(),
  restartServer: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')

  return createViteDevServer({
    root: PACKAGE_ROOT,
    plugins: [
      pluginIndexHtml(),
      pluginReact(),
      pluginConfig(config, restartServer),
      pluginRoutes({ root: config.root })
    ],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  })
}
