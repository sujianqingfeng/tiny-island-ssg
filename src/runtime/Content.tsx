import { useRoutes } from 'react-router-dom'

import A from '../../docs/guide/a'
import B from '../../docs/b'
import Index from '../../docs/guide/index'

const routers = [
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/a',
    element: <A />
  },
  {
    path: '/b',
    element: <B />
  }
]

export const Content = () => {
  const routeElement = useRoutes(routers)
  return routeElement
}
