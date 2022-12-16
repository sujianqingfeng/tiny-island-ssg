import { createRoot } from 'react-dom/client'
import { App } from './app'
import siteData from 'tiny-island:site-data'
import { BrowserRouter } from 'react-router-dom'

console.log('siteData', siteData)

function renderInBrowser() {
  const el = document.getElementById('root')
  if (!el) {
    throw new Error('No element with id "root" found')
  }

  createRoot(el).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

renderInBrowser()
