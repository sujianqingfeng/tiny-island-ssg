import { createServer as createViteDevServer } from 'vite';
import { pluginIndexHtml } from './plugin-island/index-html';
import pluginReact from '@vitejs/plugin-react'

export async function createDevServer(root = process.cwd()){

  return createViteDevServer({
    root,
    plugins:[
      pluginIndexHtml(),
      pluginReact()
    ]
  })
}