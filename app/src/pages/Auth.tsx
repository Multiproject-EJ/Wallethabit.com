import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'

import IntegrationStatus from '../components/IntegrationStatus'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'

export default function Auth() {
  const {
    state: { profile },
    isAuthenticated,
    signIn,
    signOut,
    resetDemoData,
  } = useDemoData()

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-600">
          Supabase auth hooks in soon. For now, WalletHabit keeps a demo profile in your browser so you
          can explore the post-login experience.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        <p>
          <strong>Status:</strong> {isAuthenticated ? 'Signed in to demo workspace' : 'Signed out'}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Name:</strong> {profile.fullName}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={isAuthenticated ? signOut : signIn}
            className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
          >
            {isAuthenticated ? 'Sign out of demo' : 'Resume demo session'}
          </button>
          <button
            type="button"
            onClick={resetDemoData}
            className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/50 hover:text-brand"
          >
            Reset demo data
          </button>
        </div>
        <p className="text-xs text-slate-500">
          When Supabase credentials are added, this screen will convert to email magic links and OAuth
          providers while preserving these flows.
        </p>
      </div>

      <div className="text-center text-xs text-slate-500">
        Have feedback?{' '}
        <Link to="/pricing" className="font-semibold text-brand hover:text-brand-dark">
          Explore plans
        </Link>{' '}
        or check the roadmap while we wire this up.
      </div>

      <IntegrationStatus
        label="Supabase integration"
        ready={hasSupabaseConfig}
        description={
          hasSupabaseConfig
            ? 'Env secrets detected. Once RLS policies land we can enable sign-in and profiles.'
            : 'Waiting on Supabase URL + anon key to land in the environment before wiring auth.'
        }
        guidance={supabaseEnvGuidance}
      />
    </div>
  )
}
