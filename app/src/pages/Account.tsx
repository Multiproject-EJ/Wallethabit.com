import { Link } from 'react-router-dom'

import GuidesOverview from '../components/GuidesOverview'
import { useSupabaseApp } from '../lib/supabaseDataStore'

export default function Account() {
  const { isEnabled, status, error, session, profile, purchases, unlockedModules, modules, refresh } = useSupabaseApp()

  const lockedModules = isEnabled
    ? modules.filter((module) => !unlockedModules.some((unlock) => unlock.module.id === module.id))
    : []

  return (
    <div className="flex flex-1 flex-col gap-12 py-6">
      <GuidesOverview />

      <div className="space-y-8">
        {!isEnabled ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Customer accounts need Supabase</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm">
              Add <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">VITE_SUPABASE_URL</code> and{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">VITE_SUPABASE_ANON_KEY</code> to your environment to wire up
              sign-in, purchases, and module access.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Back to sign-in
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900">Account overview</h1>
              <p className="max-w-3xl text-sm text-slate-600">
                Manage the customer record that lives in Supabase. Purchases, module access, and plan data update instantly so members
                always see the experiences they have unlocked.
              </p>
            </header>

            {status === 'loading' ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-600 shadow-sm">
                Loading the latest account details…
              </div>
            ) : null}

            {status === 'error' && error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                <p className="font-semibold">We could not load account details.</p>
                <p>{error}</p>
                <button
                  type="button"
                  onClick={refresh}
                  className="mt-3 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {session ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
                <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in as</p>
                      <p className="text-lg font-semibold text-slate-900">{session.user.email}</p>
                      <p className="text-sm text-slate-600">
                        {profile?.full_name ? `Profile name: ${profile.full_name}` : 'Add your name from the Auth screen.'}
                      </p>
                    </div>
                    <div className="rounded-full bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand">
                      {profile?.plan_tier ?? 'freemium'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Purchases</h2>
                    {purchases.length === 0 ? (
                      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        No purchases yet. Freemium access is active by default.
                      </p>
                    ) : (
                      <ul className="space-y-3 text-sm">
                        {purchases.map((purchase) => (
                          <li key={purchase.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-slate-900">{purchase.plan_tier}</span>
                              <span className="text-xs uppercase tracking-wide text-slate-500">{purchase.status}</span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {new Date(purchase.created_at).toLocaleString()} · {purchase.provider}
                              {purchase.reference ? ` · Ref ${purchase.reference}` : ''}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Unlocked modules</h2>
                    {unlockedModules.length === 0 ? (
                      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        Modules will unlock automatically when a plan is active.
                      </p>
                    ) : (
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {unlockedModules.map((item) => (
                          <li key={item.id} className="rounded-2xl border border-brand/40 bg-brand/5 p-4 text-sm text-brand-dark">
                            <p className="font-semibold text-brand-dark">{item.module.name}</p>
                            <p className="text-xs text-brand-dark/70">{item.module.description}</p>
                            <p className="mt-2 text-[11px] uppercase tracking-wide text-brand-dark/60">
                              Unlocked {new Date(item.unlocked_at).toLocaleDateString()} via {item.unlocked_by ?? 'system'}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>

                <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">Locked modules</h2>
                  <p className="text-sm text-slate-600">
                    Upgrade plans will unlock these premium experiences when Stripe checkout launches.
                  </p>
                  <Link
                    to="/affirmation"
                    className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-brand hover:bg-white hover:shadow-sm"
                  >
                    <p className="text-base font-semibold text-slate-900">Affirmations</p>
                    <p className="mt-1 text-sm text-slate-600">Visit your daily affirmation space.</p>
                  </Link>
                  {lockedModules.length === 0 ? (
                    <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      Everything is unlocked for this account.
                    </p>
                  ) : (
                    <ul className="space-y-3 text-sm text-slate-700">
                      {lockedModules.map((module) => (
                        <li key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">{module.name}</p>
                          <p className="text-xs text-slate-500">{module.description}</p>
                          <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">Premium module</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    to="/auth"
                    className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
                  >
                    Update account details
                  </Link>
                </aside>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">Sign in to manage your account</p>
                <p className="mt-2">
                  Head to the{' '}
                  <Link to="/auth" className="font-semibold text-brand hover:text-brand-dark">
                    auth portal
                  </Link>{' '}
                  to create or resume your WalletHabit account.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
