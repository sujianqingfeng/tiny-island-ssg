import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

import { describe, test, expect } from 'vitest'

describe('Markdown compile cases', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)

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
})
