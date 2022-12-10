import { resolve } from 'path'
import fse from 'fs-extra'
import { loadConfigFromFile } from 'vite'
import type { SiteData, UserConfig } from '../shared/types'

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

export async function resolveUserConfig(
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

export function resolveSiteData(useConfig: UserConfig): UserConfig {
  const { title, description, themeConfig, vite } = useConfig
  return {
    title: title || 'tiny-island.js',
    description: description || 'ssg framework',
    themeConfig: themeConfig || {},
    vite: vite || {}
  }
}

export async function resolveConfig(
  root: string,
  command: 'build' | 'serve',
  mode: 'development' | 'production'
) {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode)

  const siteData: SiteData = {
    root,
    configPath,
    siteData: resolveSiteData(userConfig as UserConfig)
  }

  return siteData
}

export function defineConfig(config: UserConfig) {
  return config
}
