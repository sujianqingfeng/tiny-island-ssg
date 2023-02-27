import { throttle } from 'lodash-es'

let links: HTMLAnchorElement[] = []
// 导航栏高度
const NAV_HEIGHT = 56

export function scrollToTarget(target: HTMLElement, isSmooth: boolean) {
  const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10)
  const targetTop =
    window.scrollY +
    target.getBoundingClientRect().top +
    targetPadding -
    NAV_HEIGHT
  window.scrollTo({
    left: 0,
    top: targetTop,
    behavior: isSmooth ? 'smooth' : 'auto'
  })
}

export function bindingAsideScroll() {
  const marker = document.getElementById('aside-marker')
  const aside = document.getElementById('aside-container')
  const headers = Array.from(aside.getElementsByTagName('a') || []).map(
    (item) => decodeURIComponent(item.hash)
  )

  if (!aside) {
    return
  }

  const activate = (links: HTMLAnchorElement[], index: number) => {
    const current = links[index]
    if (current) {
      const id = current.getAttribute('href')
      const tocIndex = headers.findIndex((item) => item === id)

      const currentLink = aside.querySelector(`a[href="#${id.slice(1)}"]`)
      if (currentLink) {
        marker.style.top = `${33 + tocIndex * 28}px`
        marker.style.opacity = '1'
      }
    }
  }

  const setActiveLink = () => {
    links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('.island-doc .header-anchor')
    ).filter((item) => item.parentElement?.tagName !== 'H1')

    const isBottom =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight
    // 1. 如果已经滑动到底部，我们将最后一个 link 高亮即可

    if (isBottom) {
      activate(links, links.length - 1)
      return
    }

    for (let i = 0; i < links.length; i++) {
      const currentAnchor = links[i]
      const nextAnchor = links[i + 1]
      const scrollTop = Math.ceil(window.scrollY)

      const currentAnchorTop =
        currentAnchor.parentElement.offsetTop - NAV_HEIGHT
      // 高亮最后一个锚点
      if (!nextAnchor) {
        activate(links, i)
        break
      }
      // 高亮第一个锚点的情况
      if ((i === 0 && scrollTop < currentAnchorTop) || scrollTop == 0) {
        activate(links, 0)
        break
      }
      // 如果当前 scrollTop 在 i 和 i + 1 个锚点之间
      const nextAnchorTop = nextAnchor.parentElement.offsetTop - NAV_HEIGHT
      if (scrollTop >= currentAnchorTop && scrollTop < nextAnchorTop) {
        activate(links, i)
        break
      }
    }
  }

  const throttleSetActiveLink = throttle(setActiveLink, 100)
  window.addEventListener('scroll', throttleSetActiveLink)

  return () => {
    window.removeEventListener('scroll', throttleSetActiveLink)
  }
}
