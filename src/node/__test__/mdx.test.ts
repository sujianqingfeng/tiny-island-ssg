import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import { describe, test, expect } from 'vitest'
import { rehypePluginPreWrapper } from '../plugin-mdx/rehype-plugins/pre-wrapper'

describe('Markdown compile cases', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypePluginPreWrapper)

  test('Compile title', () => {
    const content = '# 123'
    const result = processor.processSync(content)
    expect(result).toMatchInlineSnapshot(`
      VFile {
        "cwd": "/home/white-letter/work-space/i/tiny-island-ssg",
        "data": {},
        "history": [],
        "messages": [],
        "value": "<h1>123</h1>",
      }
    `)
  })

  test('Compile code', () => {
    const content = 'i am using `tiny-island`'
    const result = processor.processSync(content)
    expect(result).toMatchInlineSnapshot(`
      VFile {
        "cwd": "/home/white-letter/work-space/i/tiny-island-ssg",
        "data": {},
        "history": [],
        "messages": [],
        "value": "<p>i am using <code>tiny-island</code></p>",
      }
    `)
  })

  test('Compile code black', () => {
    const mdContent = '```js\nconsole.log(123);\n```'
    const result = processor.processSync(mdContent)
    expect(result.value).toMatchInlineSnapshot(`
      "<div class=\\"language-js\\"><span class=\\"lang\\">js</span><pre><code class=\\"language-js\\">console.log(123);
      </code></pre></div>"
    `)
  })
})
