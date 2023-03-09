import { usePageData } from '@runtime'
import { NavItemWithLink } from 'shared/types'
import { SwitchAppearance } from '../SwitchAppearance'
import styles from './index.module.scss'

function MenuItem({ item }: { item: NavItemWithLink }) {
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
    <header fixed="~" pos="t-0 l-0" w="full" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        className={`h-14 divider-bottom ${styles.nav}`}
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
              return <MenuItem item={item} key={item.text} />
            })}
          </div>
          <div>
            <div flex="~" before="menu-item-before">
              <SwitchAppearance />
            </div>
          </div>
          <div before="menu-item-before" className={styles.socialLinkIcon}>
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
