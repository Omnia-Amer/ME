import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Dark-only for now — the light theme + toggle are built but disabled.
document.documentElement.setAttribute('data-theme', 'dark')
try {
  localStorage.removeItem('omnia_theme')
} catch {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
