import { createRoot } from 'react-dom/client'
import { App } from './app'

function renderInBrowser() {
  const el = document.getElementById('root')
  if (!el) {
    throw new Error('No element with id "root" found')
  }

  createRoot(el).render(<App />)
}

renderInBrowser()
