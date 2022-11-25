import { cac } from 'cac';
import { resolve } from 'path';
import { build } from './build';
import { createDevServer } from './dev';

const version = require('../../package.json').version

const cli = cac('tiny-island').version(version).help()

cli
.command('[root]','start dev server')
.alias('dev').action(async (root:string)=>{
  const server = await createDevServer(root)
  await server.listen()
  server.printUrls()
})

cli
.command('build [root]','build for production')
.action(async(root:string)=>{
  try {
    root = resolve(root)
    await build(root)
  } catch (error) {
    console.error(error);
  }
})

cli.parse()