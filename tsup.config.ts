import {defineConfig} from 'tsup'

export default defineConfig({
  entry:['src/node/cli.ts'],
  bundle:true,
  dts:true,
  format:['cjs','esm'],
  outDir:'dist',
  shims:true
})