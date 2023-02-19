import { usePageData } from '@runtime'
import { NavItemWithLink } from 'shared/types'
import styles from './index.module.scss'

function MenuItem(item: NavItemWithLink) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={styles.link}>
        {item.text}
      </a>
    </div>
  )
}

export function Nav() {
  const { siteData } = usePageData()
  const nav = siteData.themeConfig.nav
  return (
    <header relative="~" w="full">
      <div
        flex="~"
        items="center"
        justify="between"
        className="px-8 h-14 divider-bottom"
      >
        <div>
          <a
            href="/"
            className="w-full h-full text-1rem font-semibold flex items-center"
            hover="opacity-60"
          >
            Island.js
          </a>
        </div>
        <div flex="~">
          <div flex="~">
            {nav.map((item) => {
              return <MenuItem {...item} key={item.text} />
            })}
          </div>
          <div></div>
          <div className={styles.socialLinkIcon}>
            <a
              className="i-carbon-logo-github w-5 h-5 fill-current"
              href=""
            ></a>
          </div>
        </div>
      </div>
    </header>
  )
}
