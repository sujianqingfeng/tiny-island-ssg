import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Text, Root } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import shiki from 'shiki'

interface Options {
  highLighter: shiki.Highlighter
}

export const rehypePluginShiki: Plugin<[Options], Root> = ({ highLighter }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      const firstChild = node.children[0]
      if (
        node.tagName === 'pre' &&
        firstChild?.type === 'element' &&
        firstChild?.tagName === 'code'
      ) {
        // first
        const codeContent = (firstChild.children[0] as Text).value
        const codeClass = firstChild.properties?.className?.toString() || ''
        const lang = codeClass.split('-')[1]

        if (!lang) return

        // code -> highlight code
        const highlightedCode = highLighter.codeToHtml(codeContent, { lang })
        // html -> ast
        const fragmentAst = fromHtml(highlightedCode, { fragment: true })
        parent.children.splice(index, 1, ...fragmentAst.children)
      }
    })
  }
}
