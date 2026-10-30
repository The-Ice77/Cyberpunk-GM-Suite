import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { refreshCodexCatalog } from './services/codexCatalog'

// Carrega o Homebrew persistido (IndexedDB) no catálogo do Códice usado pelos geradores
refreshCodexCatalog()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
