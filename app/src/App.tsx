import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Auth from './pages/Auth'
import Budget from './pages/Budget'
import Assistant from './pages/Assistant'
import Goals from './pages/Goals'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import Integrations from './pages/Integrations'
import Debt from './pages/Debt'
import Income from './pages/Income'
import Investing from './pages/Investing'
import Retirement from './pages/Retirement'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="budget" element={<Budget />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="goals" element={<Goals />} />
          <Route path="debt" element={<Debt />} />
          <Route path="income" element={<Income />} />
          <Route path="investing" element={<Investing />} />
          <Route path="retirement" element={<Retirement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

