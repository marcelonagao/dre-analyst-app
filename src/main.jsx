import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App' // <-- Removemos a extensão .tsx daqui

createRoot(document.getElementById('root')).render( // <-- Removemos a exclamação (!) daqui
  <StrictMode>
    <App />
  </StrictMode>,
)