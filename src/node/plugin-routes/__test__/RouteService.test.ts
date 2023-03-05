import { describe, test, expect } from 'vitest'
import { join } from 'path'

import { RouteService } from '../RouteService'

describe('RouteService', async () => {
  const testDir = join(__dirname, 'fixtures')
  const routeService = new RouteService(testDir)
  await routeService.init()

  test('conventional route by file structure', async () => {
    const routeMeta = routeService.getRouteMeta().map((item) => {
      return {
        ...item,
        absolutePath: item.absolutePath.replace(testDir, 'TEST_DIR')
      }
    })

    expect(routeMeta).toMatchInlineSnapshot(`
      [
        {
          "absolutePath": "TEST_DIR/b.mdx",
          "routePath": "/b",
        },
        {
          "absolutePath": "TEST_DIR/guide/a.mdx",
          "routePath": "/guide/a",
        },
      ]
    `)
  })

  test('generate route code', () => {
    const code = routeService
      .generateRoutesCode(false)
      .replace(new RegExp(testDir, 'g'), 'TEST_DIR')
    expect(code).toMatchInlineSnapshot(`
      "
          import React from 'react';
          import loadable from \\"@loadable/component\\";
          const Route0 = loadable(()=> import('TEST_DIR/b.mdx'));
      const Route1 = loadable(()=> import('TEST_DIR/guide/a.mdx'));
          export const routes =[
            {path: '/b', element: React.createElement(Route0), preload:()=> import('TEST_DIR/b.mdx')},
      {path: '/guide/a', element: React.createElement(Route1), preload:()=> import('TEST_DIR/guide/a.mdx')} 
          ]
          "
    `)
  })
})
