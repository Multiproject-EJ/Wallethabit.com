import { NavLink, Outlet } from 'react-router-dom'

import DemoUserBadge from './DemoUserBadge'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assistant', label: 'AI copilot' },
  { to: '/integrations', label: 'Bank sync lab' },
  { to: '/debt', label: 'Debt payoff lab' },
  { to: '/income', label: 'Income boost lab' },
  { to: '/investing', label: 'Investment lab' },
  { to: '/protection', label: 'Protection lab' },
  { to: '/estate', label: 'Estate lab' },
  { to: '/tax', label: 'Tax strategy lab' },
  { to: '/retirement', label: 'Retirement lab' },
  { to: '/security', label: 'Security & trust' },
  { to: '/goals', label: 'Goals tracker' },
  { to: '/budget', label: 'Budget planner' },
  { to: '/settings', label: 'Profile & settings' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/auth', label: 'Sign in' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-sand text-navy">
      <header className="border-b border-sand-darker/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
          <NavLink to="/" end className="text-lg font-semibold tracking-tight text-navy">
            Wallet<span className="text-primary-light">Habit</span>
          </NavLink>
          <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm font-medium text-navy/80">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-2 transition-colors border border-transparent',
                    isActive
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

      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-7xl flex-1 flex-col px-6 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-sand-darker/60 bg-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-navy/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WalletHabit.com. All rights reserved.</p>
          <a className="hover:text-primary-dark" href="mailto:hello@wallethabit.com">
            hello@wallethabit.com
          </a>
        </div>
      </footer>
    </div>
  )
}
