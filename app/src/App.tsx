import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import UpdateHub from './pages/Update'
import Community from './pages/Community'
import Habits from './pages/Habits'
import NotFound from './pages/NotFound'
import Budget from './pages/Budget'
import Debt from './pages/Debt'
import Goals from './pages/Goals'
import Income from './pages/Income'
import Investing from './pages/Investing'
import Retirement from './pages/Retirement'
import Taxes from './pages/Taxes'
import Protection from './pages/Protection'
import Estate from './pages/Estate'
import Security from './pages/Security'
import Integrations from './pages/Integrations'
import Assistant from './pages/Assistant'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="start" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="update" element={<UpdateHub />} />
          <Route path="budget" element={<Budget />} />
          <Route path="debt" element={<Debt />} />
          <Route path="goals" element={<Goals />} />
          <Route path="income" element={<Income />} />
          <Route path="investing" element={<Investing />} />
          <Route path="retirement" element={<Retirement />} />
          <Route path="taxes" element={<Taxes />} />
          <Route path="protection" element={<Protection />} />
          <Route path="estate" element={<Estate />} />
          <Route path="security" element={<Security />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="community" element={<Community />} />
          <Route path="habits" element={<Habits />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
