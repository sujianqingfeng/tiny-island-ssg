import { resolve } from 'path'
import fse from 'fs-extra'
import { loadConfigFromFile } from 'vite'
import type { UserConfig } from '../shared/types'

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

function getUserConfigPath(root: string) {
  const supportConfigFiles = ['config.ts', 'config.js']
  try {
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fse.pathExistsSync)
    return configPath
  } catch (error) {
    console.error(`Failed to load user config:${error}`)
    throw error
  }
}

export async function resolveConfig(
  root: string,
  command: 'build' | 'serve',
  mode: 'development' | 'production'
) {
  // 1. parse config path
  const configPath = getUserConfigPath(root)
  // 2. parse config
  const result = await loadConfigFromFile({ command, mode }, configPath, root)

  if (!result) {
    return [configPath, {} as RawConfig] as const
  }

  const { config: rawConfig = {} as RawConfig } = result

  const userConfig = await (typeof rawConfig === 'function'
    ? rawConfig()
    : rawConfig)

  return [configPath, userConfig] as const
}
