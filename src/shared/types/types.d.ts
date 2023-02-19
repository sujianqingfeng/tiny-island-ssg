declare module 'tiny-island:site-data' {
  import type { UserConfig } from 'shared/types'
  const siteData: UserConfig
  export default siteData
}

declare module 'tiny-island:routes' {
  import { RouteObject } from 'react-router-dom'
  export const routes: RouteObject[]
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}
