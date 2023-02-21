import { Route } from 'node/plugin-routes'
import { matchRoutes } from 'react-router-dom'
import { PageData } from 'shared/types'
import { routes } from 'tiny-island:routes'
import siteData from 'tiny-island:site-data'
import { Layout } from '../theme-default'

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath)

  if (matched) {
    const route = matched[0].route as Route
    const moduleInfo = await route.preload()

    return {
      pageType: moduleInfo.frontmatter?.pageType ?? 'doc',
      siteData,
      pagePath: routePath,
      frontmatter: moduleInfo.frontmatter
    }
  }

  return {
    pageType: '404',
    siteData: siteData,
    pagePath: routePath,
    frontmatter: {}
  }
}

export function App() {
  return <Layout />
}
