import { Link } from 'react-router-dom'

import IntegrationStatus from '../components/IntegrationStatus'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'

export default function Auth() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-600">
          Supabase auth hooks in soon. For now, this screen maps the layout for email magic links and
          OAuth providers.
        </p>
      </header>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        <label className="block text-left text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          disabled
        />
        <button
          type="submit"
          disabled
          className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send magic link (coming soon)
        </button>
      </form>

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
