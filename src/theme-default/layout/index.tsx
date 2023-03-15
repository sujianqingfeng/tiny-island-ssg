import { usePageData } from '@runtime'
import 'uno.css'
import '../styles/base.css'
import '../styles/vars.css'
import '../styles/doc.css'
import { Nav } from '../components/Nav'
import { HomeLayout } from './HomeLayout'
import { DocLayout } from './DocLayout'
import { Helmet } from 'react-helmet-async'

export function Layout() {
  const pageData = usePageData()

  const { pageType, title } = pageData

  const getContext = () => {
    if (pageType === 'home') {
      return <HomeLayout />
    } else if (pageType === 'doc') {
      return <DocLayout />
    } else {
      return <div>404</div>
    }
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Nav />
      <section style={{ paddingTop: 'var(--island-nav-height)' }}>
        {getContext()}
      </section>
    </div>
  )
}
