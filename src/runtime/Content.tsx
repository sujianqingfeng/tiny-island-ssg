import { useRoutes } from 'react-router-dom'
import { routes } from 'tiny-island:routes'

export const Content = () => {
  const routeElement = useRoutes(routes)
  return routeElement
}
