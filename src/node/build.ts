import { build as viteBuild, InlineConfig } from 'vite'
import {
  CLIENT_ENTRY_PATH,
  EXTERNALS,
  MASK_SPLITTER,
  PACKAGE_ROOT,
  SERVER_ENTRY_PATH
} from './constants'
import { dirname, join } from 'path'
import type { RollupOutput } from 'rollup'
import fs from 'fs-extra'
import type { SiteConfig } from 'shared/types'
import { createVitePlugin } from './vite-plugins'
import { Route } from './plugin-routes'
import { RenderResult } from 'runtime/ssr-entry'

const CLIENT_OUTPUT = 'build'

async function bundle(root: string, config: SiteConfig) {
  const resolveViteConfig = async (
    isServer: boolean
  ): Promise<InlineConfig> => {
    return {
      mode: 'production',
      root,
      plugins: await createVitePlugin(config, null, isServer),
      ssr: {
        noExternal: ['react-router-dom', 'lodash-es']
      },
      build: {
        ssr: isServer,
        outDir: isServer ? join(root, '.temp') : join(root, 'build'),
        rollupOptions: {
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output: {
            format: isServer ? 'cjs' : 'esm'
          },
          external: EXTERNALS
        }
      }
    }
  }

  console.log('Building client + server bundles...')

  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(await resolveViteConfig(false)),
      viteBuild(await resolveViteConfig(true))
    ])
    await fs.copy(join(PACKAGE_ROOT, 'vendors'), join(root, CLIENT_OUTPUT))
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
  } catch (error) {
    console.error(error)
  }
}

async function buildIsLands(
  root: string,
  islandPathToMap: Record<string, string>
) {
  const islandInjectCode = `${Object.entries(islandPathToMap)
    .map(
      ([islandName, islandPath]) =>
        `import {${islandName}} from '${islandPath}}'`
    )
    .join('')}
  window.ISLANDS = { ${Object.keys(islandPathToMap).join('')} };
  window.ISLANDS_PROPS = JSON.parse(
    document.getElementById('islands-props').textContent
  )
  `
  const injectId = 'island:inject'

  return viteBuild({
    mode: 'production',
    esbuild: {
      jsx: 'automatic'
    },
    build: {
      outDir: join(root, '.temp'),
      rollupOptions: {
        input: injectId,
        external: EXTERNALS
      }
    },
    plugins: [
      {
        name: 'island:inject',
        enforce: 'post',
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importer] = id.split(MASK_SPLITTER)
            return this.resolve(originId, importer, { skipSelf: true })
          }
          if (id === injectId) {
            return id
          }
        },
        load(id) {
          if (id === injectId) {
            return islandInjectCode
          }
        },
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name]
            }
          }
        }
      }
    ]
  })
}

async function renderPages(
  render: (url: string) => Promise<RenderResult>,
  routes: Route[],
  root: string,
  clientBundle: RollupOutput
) {
  console.log('Rendering page in server side...')

  const clientChunk = clientBundle.output.find(
    (item) => item.type === 'chunk' && item.isEntry
  )

  return Promise.all(
    routes.map(async (route) => {
      const routePath = route.path
      const { appHtml, islandToPathMap } = await render(routePath)
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      )
      await buildIsLands(root, islandToPathMap)
      const normalizeVendorFilename = (fileName: string) =>
        fileName.replace(/\//g, '_') + '.js'
      const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
      ${styleAssets
        .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
        .join('\n')}
    <script type="importmap">
      {
        "imports": {
          ${EXTERNALS.map(
            (name) => `"${name}": "/${normalizeVendorFilename(name)}"`
          ).join(',')}
        }
      }
    </script>
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim()

      const fileName = routePath.endsWith('/')
        ? `${routePath}index.html`
        : `${routePath}.html`

      await fs.ensureDir(join(root, 'build', dirname(fileName)))
      await fs.writeFile(join(root, 'build', fileName), html)
      await fs.remove(join(root, '.temp'))
    })
  )
}

export async function build(root: string = process.cwd(), config: SiteConfig) {
  const [clientBundle] = await bundle(root, config)
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js')

  const { render, routes } = await import(serverEntryPath)

  await renderPages(render, routes, root, clientBundle)
}
