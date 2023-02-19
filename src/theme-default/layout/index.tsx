import { Content, usePageData } from '@runtime'
import 'uno.css'
import '../styles/base.css'
import '../styles/vars.css'
import { Nav } from '../components/Nav'

export function Layout() {
  const pageData = usePageData()

  const { pageType } = pageData

  const getContext = () => {
    if (pageType === 'home') {
      return <div>home</div>
    } else if (pageType === 'doc') {
      return <Content></Content>
    } else {
      return <div>404</div>
    }
  }

  return (
    <div>
      <Nav />
    </div>
  )
}
