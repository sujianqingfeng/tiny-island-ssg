import React from 'react'
import { PageModule } from 'shared/types'
import type { Plugin } from 'vite'
import { RouteService } from './RouteService'

export interface Route {
  path: string
  element: React.ReactElement
  filePath: string
  preload: () => Promise<PageModule>
}

interface PluginOptions {
  root: string
  isSSR: boolean
}

const CONVENTION_ROUTE_ID = 'tiny-island:routes'

export function pluginRoutes(options: PluginOptions): Plugin {
  const routeService = new RouteService(options.root)
  return {
    name: 'tiny-island:routers',
    async configResolved() {
      await routeService.init()
    },
    resolveId(id) {
      if (id === CONVENTION_ROUTE_ID) {
        return '\0' + CONVENTION_ROUTE_ID
      }
    },
    load(id) {
      if (id === '\0' + CONVENTION_ROUTE_ID) {
        return routeService.generateRoutesCode(options.isSSR || false)
      }
    }
  }
}
