import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assistant', label: 'AI copilot' },
  { to: '/integrations', label: 'Bank sync lab' },
  { to: '/debt', label: 'Debt payoff lab' },
  { to: '/income', label: 'Income boost lab' },
  { to: '/investing', label: 'Investment lab' },
  { to: '/retirement', label: 'Retirement lab' },
  { to: '/goals', label: 'Goals tracker' },
  { to: '/budget', label: 'Budget planner' },
  { to: '/settings', label: 'Profile & settings' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/auth', label: 'Sign in' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" end className="text-lg font-semibold">
            Wallet<span className="text-brand">Habit</span>
          </NavLink>
          <nav className="flex gap-1 text-sm font-medium">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-2 transition-colors border border-transparent',
                    isActive
                      ? 'bg-brand/10 text-brand border-brand/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-6xl flex-1 flex-col px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WalletHabit.com. All rights reserved.</p>
          <a className="hover:text-slate-800" href="mailto:hello@wallethabit.com">
            hello@wallethabit.com
          </a>
        </div>
      </footer>
    </div>
  )
}
