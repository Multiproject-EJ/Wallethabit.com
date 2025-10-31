import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DemoDataProvider } from './lib/demoDataStore'
import { SupabaseProvider } from './lib/supabaseDataStore'
import { initPwa } from './lib/pwaClient'
import './index.css'

initPwa()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <DemoDataProvider>
        <App />
      </DemoDataProvider>
    </SupabaseProvider>
  </React.StrictMode>,
)

