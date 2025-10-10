import { NavLink, Outlet } from 'react-router-dom'

import DemoUserBadge from './DemoUserBadge'
import { useDemoData } from '../lib/demoDataStore'

const navItems = [
  { to: '/', label: 'Start', end: true },
  { to: '/community', label: 'Community' },
  { to: '/habits', label: 'Habits', accent: true },
]

export default function Layout() {
  const { isAuthenticated } = useDemoData()

  return (
    <div className="min-h-screen bg-sand text-navy">
      <header className="border-b border-sand-darker/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
          <NavLink to="/" end className="text-lg font-semibold tracking-tight text-navy">
            Wallet<span className="text-primary-light">Habit</span>
          </NavLink>
          <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm font-medium text-navy/80">
            {navItems.map(({ to, label, end, accent }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-2 transition-colors border border-transparent',
                    accent
                      ? isAuthenticated
                        ? [
                            'border-[3px] border-gold text-navy font-semibold ring-2 ring-gold/40 ring-offset-2 ring-offset-white shadow-[0_0_20px_rgba(251,191,36,0.55)]',
                            isActive
                              ? 'bg-transparent shadow-[0_0_30px_rgba(251,191,36,0.65)]'
                              : 'bg-transparent hover:bg-gold/10 hover:text-navy/90 hover:shadow-[0_0_26px_rgba(251,191,36,0.7)]',
                          ].join(' ')
                        : isActive
                        ? 'bg-gold text-navy font-semibold shadow-[0_10px_30px_rgba(31,42,68,0.22)]'
                        : 'bg-gold/80 text-navy font-semibold shadow-sm hover:bg-gold hover:text-navy/90'
                      : isActive && !(to === '/' && !isAuthenticated)
                      ? 'bg-primary/10 text-primary border-primary/30 shadow-sm'
                      : 'hover:text-primary-dark hover:bg-white/60',
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

      <footer className="border-t border-sand-darker/60 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-navy/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WalletHabit.com. All rights reserved.</p>
          <a className="hover:text-primary-dark" href="mailto:hello@wallethabit.com">
            hello@wallethabit.com
          </a>
        </div>
      </footer>
    </div>
  )
}
