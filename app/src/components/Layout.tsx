import { NavLink, Outlet } from 'react-router-dom'

import DemoUserBadge from './DemoUserBadge'
import { useDemoData } from '../lib/demoDataStore'

const navItems = [
  { to: '/', label: 'Start', end: true },
  { to: '/community', label: 'Community' },
  { to: '/habits', label: 'Habits', accent: true },
]

export default function Layout() {
  const {
    state: { profile },
    isAuthenticated,
  } = useDemoData()

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  const accentActiveClass = isUltimate
    ? 'bg-[#d9cbb8] text-[#3f2a1e] font-semibold shadow-[0_12px_30px_rgba(63,42,30,0.18)]'
    : 'bg-gold text-navy font-semibold shadow-[0_10px_30px_rgba(31,42,68,0.22)]'

  const accentIdleClass = isUltimate
    ? 'bg-[#efe2cc] text-[#3f2a1e] font-semibold shadow-sm hover:bg-[#e3d3b9] hover:text-[#34271c]'
    : 'bg-gold/80 text-navy font-semibold shadow-sm hover:bg-gold hover:text-navy/90'

  const navActiveClass = isUltimate
    ? 'bg-[#e5ecdf] text-[#5c7751] border-[#8aa27b] shadow-sm'
    : 'bg-primary/10 text-primary border-primary/30 shadow-sm'

  const navHoverClass = isUltimate
    ? 'hover:text-[#4f6745] hover:bg-[#f3e7d4]'
    : 'hover:text-primary-dark hover:bg-white/60'

  return (
    <div
      className={`min-h-screen transition-colors ${
        isUltimate ? 'bg-[#f4efe6] text-[#3f2a1e]' : 'bg-sand text-navy'
      }`}
    >
      <header
        className={`border-b backdrop-blur transition-colors ${
          isUltimate ? 'border-[#e0d1bd] bg-[#fdf8f0]/90' : 'border-sand-darker/60 bg-white/80'
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
          <NavLink
            to="/"
            end
            className={`text-lg font-semibold tracking-tight transition-colors ${
              isUltimate ? 'text-[#3f2a1e]' : 'text-navy'
            }`}
          >
            Wallet
            <span className={isUltimate ? 'text-[#5c7751]' : 'text-primary-light'}>Habit</span>
          </NavLink>
          <nav
            className={`flex flex-1 flex-wrap items-center gap-1 text-sm font-medium transition-colors ${
              isUltimate ? 'text-[#5b4a39]' : 'text-navy/80'
            }`}
          >
            {navItems.map(({ to, label, end, accent }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-2 transition-colors border border-transparent',
                    accent && !isAuthenticated
                      ? isActive
                        ? accentActiveClass
                        : accentIdleClass
                      : isActive && !(to === '/' && !isAuthenticated)
                      ? navActiveClass
                      : navHoverClass,
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <DemoUserBadge />
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-1 flex-col px-6 py-12">
        <Outlet />
      </main>

      <footer
        className={`border-t transition-colors ${
          isUltimate ? 'border-[#e0d1bd] bg-[#fdf8f0]/95' : 'border-sand-darker/60 bg-white/80'
        }`}
      >
        <div
          className={`mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
            isUltimate ? 'text-[#5b4a39]' : 'text-navy/70'
          }`}
        >
          <p>© {new Date().getFullYear()} WalletHabit.com. All rights reserved.</p>
          <a
            className={`transition-colors ${
              isUltimate ? 'hover:text-[#4f6745]' : 'hover:text-primary-dark'
            }`}
            href="mailto:hello@wallethabit.com"
          >
            hello@wallethabit.com
          </a>
        </div>
      </footer>
    </div>
  )
}
