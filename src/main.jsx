import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerPwa } from './lib/registerPwa.js'
import './index.css'
import App from './App.jsx'

registerPwa()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
