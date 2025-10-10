import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import UpdateHub from './pages/Update'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Onboarding />} />
          <Route path="start" element={<Onboarding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="update" element={<UpdateHub />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
