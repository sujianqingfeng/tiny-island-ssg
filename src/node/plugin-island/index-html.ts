import { readFile } from 'fs/promises';
import type { Plugin } from 'vite';
import { DEFAULT_HTML_PATH } from '../constants';

export function pluginIndexHtml():Plugin {
  return {
    name:'island:index-html',
    apply:'serve',
    configureServer(serve){
      return ()=>{
        serve.middlewares.use(async (req,res,next)=>{

          let html = await readFile(DEFAULT_HTML_PATH)
          try {
            res.statusCode = 200
            res.setHeader('Content-Type','text/html')
            res.end(html)
          } catch (error) {
            return next(error)
          }
        })
      }
    }
  }
}