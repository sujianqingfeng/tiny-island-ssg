import { createRoot } from 'react-dom/client'
import { App, initPageData } from './app'
import siteData from 'tiny-island:site-data'
import { BrowserRouter } from 'react-router-dom'
import { DataContext } from './hooks'
import { HelmetProvider } from 'react-helmet-async'

console.log('siteData', siteData)

async function renderInBrowser() {
  const el = document.getElementById('root')
  if (!el) {
    throw new Error('No element with id "root" found')
  }

  const pageData = await initPageData(location.pathname)
  createRoot(el).render(
    <HelmetProvider>
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContext.Provider>
    </HelmetProvider>
  )
}

renderInBrowser()
