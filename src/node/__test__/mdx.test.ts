import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { describe, test, expect } from 'vitest'
import { getHighlighter } from 'shiki'

import { rehypePluginPreWrapper } from '../plugin-mdx/rehype-plugins/pre-wrapper'
import { rehypePluginShiki } from '../plugin-mdx/rehype-plugins/shiki'

describe('Markdown compile cases', async () => {
  // 注意 這裏有順序
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePluginPreWrapper)
    .use(rehypePluginShiki, {
      highLighter: await getHighlighter({ theme: 'nord' })
    })
    .use(rehypeStringify)

  test('Compile title', () => {
    const content = '# 123'
    const result = processor.processSync(content)
    expect(result.value).toMatchInlineSnapshot('"<h1>123</h1>"')
  })

  test('Compile code', () => {
    const content = 'i am using `tiny-island`'
    const result = processor.processSync(content)
    expect(result.value).toMatchInlineSnapshot(
      '"<p>i am using <code>tiny-island</code></p>"'
    )
  })

  test('Compile code black', () => {
    const mdContent = '```js\nconsole.log(123);\n```'
    const result = processor.processSync(mdContent)

    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre class=\\"shiki nord\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #D8DEE9\\">console</span><span style=\\"color: #ECEFF4\\">.</span><span style=\\"color: #88C0D0\\">log</span><span style=\\"color: #D8DEE9FF\\">(</span><span style=\\"color: #B48EAD\\">123</span><span style=\\"color: #D8DEE9FF\\">)</span><span style=\\"color: #81A1C1\\">;</span></span>
      <span class=\\"line\\"></span></code></pre></div>"
    `)
  })
})
