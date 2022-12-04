import path from 'path'
import fse from 'fs-extra'
import * as execa from 'execa'

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic')

const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
}

async function prepareE2E() {
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.commandSync('pnpm build', {
      cwd: path.resolve(__dirname, '../')
    })
  }

  execa.commandSync('npx playwright install', {
    ...defaultExecaOpts,
    cwd: path.join(__dirname, '../')
  })

  execa.commandSync('pnpm i', {
    ...defaultExecaOpts
  })

  execa.commandSync('pnpm dev', defaultExecaOpts)
}

prepareE2E()
