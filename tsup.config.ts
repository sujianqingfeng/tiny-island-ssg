import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/node/cli.ts', 'src/node/index.ts', 'src/node/dev.ts'],
  bundle: true,
  dts: true,
  format: ['cjs', 'esm'],
  outDir: 'dist',
  external: ['shiki'],
  shims: true,
  clean: true
})
