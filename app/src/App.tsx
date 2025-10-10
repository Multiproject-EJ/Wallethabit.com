import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import UpdateHub from './pages/Update'
import Community from './pages/Community'
import Habits from './pages/Habits'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="start" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="update" element={<UpdateHub />} />
          <Route path="community" element={<Community />} />
          <Route path="habits" element={<Habits />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
