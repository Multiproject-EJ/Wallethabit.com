import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DemoDataProvider } from './lib/demoDataStore'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DemoDataProvider>
      <App />
    </DemoDataProvider>
  </React.StrictMode>
)

