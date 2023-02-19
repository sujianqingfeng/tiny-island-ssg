import { defineConfig } from '../dist'

export default defineConfig({
  title:'test title',
  themeConfig:{
    nav:[
      {
        text:'主页',
        link:'/'
      },
      {
        text:'指南',
        link:'/'
      }
    ]
  }
})