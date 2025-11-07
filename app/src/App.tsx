import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

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
import SubscriptionTracker from './pages/SubscriptionTracker'
import BillsTracker from './pages/BillsTracker'
import Auth from './pages/Auth'
import Account from './pages/Account'
import MobileModule from './pages/MobileModule'
import Affirmation from './pages/Affirmation'
import Status from './pages/Status'
import PwaExperience from './pages/PwaExperience'
import { useDemoData } from './lib/demoDataStore'
import { useSupabaseApp } from './lib/supabaseDataStore'

type RequireCommunityAccessProps = {
  children: ReactNode
}

function RequireCommunityAccess({ children }: RequireCommunityAccessProps) {
  const {
    isAuthenticated,
  } = useDemoData()
  const { session } = useSupabaseApp()

  if (!isAuthenticated && !session) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="start" element={<Onboarding />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="auth" element={<Auth />} />
          <Route path="account" element={<Account />} />
          <Route path="affirmation" element={<Affirmation />} />
          <Route path="status" element={<Status />} />
          <Route path="pwa" element={<PwaExperience />} />
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
          <Route path="subscriptions" element={<SubscriptionTracker />} />
          <Route path="bills" element={<BillsTracker />} />
          <Route path="mobile" element={<MobileModule />} />
          <Route
            path="community"
            element={
              <RequireCommunityAccess>
                <Community />
              </RequireCommunityAccess>
            }
          />
          <Route path="habits" element={<Habits />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
