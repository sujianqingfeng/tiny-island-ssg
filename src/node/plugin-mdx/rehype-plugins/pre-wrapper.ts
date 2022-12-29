import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import type { Element, Root } from 'hast'

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const firstChild = node.children[0]

      if (
        node.tagName === 'pre' &&
        firstChild?.type === 'element' &&
        firstChild?.tagName === 'code' &&
        !node.data?.isVisited
      ) {
        const codeClassName = firstChild.properties?.className?.toString() || ''
        const lang = codeClassName.split('-')[1]

        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true
          }
        }

        node.tagName = 'div'
        node.properties = node.properties || {}
        node.properties.className = codeClassName

        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [
              {
                type: 'text',
                value: lang
              }
            ]
          },
          cloneNode
        ]
      }
    })
  }
}
