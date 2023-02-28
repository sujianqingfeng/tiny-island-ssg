/// <reference types="vite/client" />
declare module 'tiny-island:site-data' {
  import type { UserConfig } from 'shared/types'
  const siteData: UserConfig
  export default siteData
}

declare module 'tiny-island:routes' {
  import { RouteObject } from 'react-router-dom'
  export const routes: RouteObject[]
}
