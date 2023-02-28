import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import Slugger from 'github-slugger'
import { parse } from 'acorn'
import type { MdxjsEsm, Program } from 'mdast-util-mdxjs-esm'

interface TocItem {
  id: string
  text: string
  depth: number
}

interface ChildNode {
  type: 'text' | 'link' | 'inlineCode'
  value?: string
  children?: ChildNode[]
}

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = []
    const slugger = new Slugger()

    visit(tree, 'heading', (node) => {
      if (!node.depth || !node.children) {
        return
      }

      // h2-h4
      if (node.depth > 1 && node.depth < 5) {
        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case 'link':
                return (
                  child.children?.map((child) => child.value).join('') || ''
                )

              default:
                return child.value
            }
          })
          .join('')

        // 生成固定格式 詳見 https://www.npmjs.com/package/github-slugger
        const id = slugger.slug(originText)
        toc.push({
          id,
          text: originText,
          depth: node.depth
        })
      }
    })

    const insertedCode = `export const toc = ${JSON.stringify(toc, null, 2)};`

    tree.children.push({
      type: 'mdxjsEsm',
      value: insertedCode,
      data: {
        // estree 是一個ast
        estree: parse(insertedCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    } as MdxjsEsm)
  }
}
