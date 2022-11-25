import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { join } from 'path';
import type { RollupOutput  } from 'rollup';
import {writeFile,remove,ensureDir} from 'fs-extra'

async function bundle(root: string) {

  const resolveViteConfig = (isServer:boolean):InlineConfig=>{
    return {
      mode:'production',
      root,
      build:{
        ssr:isServer,
        outDir:isServer?'.temp':'build',
        rollupOptions:{
          input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
          output:{
            format: isServer ? 'cjs':'esm'
          }
        }
      }
    } 
  }

  console.log(`Building client + server bundles...`);

  try {
    const [clientBundle,serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ])
    return [clientBundle,serverBundle] as [RollupOutput,RollupOutput] 
  } catch (error) {
    console.error(error)
  }
}

async function renderPages(render:()=>string,root:string,clientBundle:RollupOutput) {
  const appHtml = render()
  const clientChunk= clientBundle.output.find(item=>item.type === 'chunk' && item.isEntry)

   console.log(`Rendering page in server side...`);

     const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>title</title>
    <meta name="description" content="xxx">
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script type="module" src="/${clientChunk?.fileName}"></script>
  </body>
</html>`.trim();


  await ensureDir(join(root,'build')) 
  await writeFile(join(root,'build','index.html'),html)
  await remove(join(root,'.temp'))
}


export async function build(root:string = process.cwd()) {
  const [clientBundle] = await bundle(root)
  const serverEntryPath = join(root,'.temp','ssr-entry.js')
  
  const {render} = require(serverEntryPath)
  await renderPages(render,root,clientBundle)
}