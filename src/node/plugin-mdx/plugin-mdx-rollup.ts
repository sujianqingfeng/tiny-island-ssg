import pluginMdx from '@mdx-js/rollup'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { getHighlighter } from 'shiki'

import { rehypePluginPreWrapper } from './rehype-plugins/pre-wrapper'
import { rehypePluginShiki } from './rehype-plugins/shiki'

export async function pluginMdxRollup() {
  return [
    pluginMdx({
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        [
          remarkMdxFrontmatter,
          {
            name: 'frontmatter'
          }
        ]
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              class: 'header-anchor'
            },
            content: {
              type: 'text',
              value: '#'
            }
          }
        ],
        rehypePluginPreWrapper,
        [
          rehypePluginShiki,
          {
            highLighter: await getHighlighter({ theme: 'nord' })
          }
        ]
      ]
    })
  ]
}
