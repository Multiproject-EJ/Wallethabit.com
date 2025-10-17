import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'
import IntegrationStatus from '../components/IntegrationStatus'
import { hasSupabaseConfig, supabaseEnvGuidance } from '../lib/supabaseClient'
import { useSupabaseApp } from '../lib/supabaseDataStore'

type PlanChoice = 'freemium' | 'stripe'

export default function Auth() {
  const {
    state: { profile },
    isAuthenticated,
    signIn,
    signOut,
    resetDemoData,
  } = useDemoData()

  const supabaseApp = useSupabaseApp()

  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signInLoading, setSignInLoading] = useState(false)

  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [planChoice, setPlanChoice] = useState<PlanChoice>('freemium')
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpNotice, setSignUpNotice] = useState<string | null>(null)
  const [signUpLoading, setSignUpLoading] = useState(false)

  const handleSupabaseSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignInError(null)
    setSignInLoading(true)

    const { error } = await supabaseApp.signInWithPassword({
      email: signInEmail.trim(),
      password: signInPassword,
    })

    if (error) {
      setSignInError(error)
    }

    setSignInLoading(false)
  }

  const handleSupabaseSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignUpError(null)
    setSignUpNotice(null)

    if (planChoice !== 'freemium') {
      setSignUpError('Stripe checkout is not ready yet. Choose the freemium plan to continue.')
      return
    }

    setSignUpLoading(true)

    const { error, needsConfirmation } = await supabaseApp.signUpFreemium({
      email: signUpEmail.trim(),
      password: signUpPassword,
      fullName: signUpName.trim(),
    })

    if (error) {
      setSignUpError(error)
    } else if (needsConfirmation) {
      setSignUpNotice('Check your email to confirm your account, then return to sign in.')
    } else {
      setSignUpNotice('Account created. You are signed in and ready to explore your account dashboard.')
      setSignUpName('')
      setSignUpEmail('')
      setSignUpPassword('')
    }

    setSignUpLoading(false)
  }

  const handleSupabaseSignOut = async () => {
    const { error } = await supabaseApp.signOut()
    if (error) {
      setSignInError(error)
    }
  }

  if (!supabaseApp.isEnabled) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold">Sign in</h1>
          <p className="text-sm text-slate-600">
            Supabase auth hooks in soon. For now, WalletHabit keeps a demo profile in your browser so you can explore the
            post-login experience.
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
            When Supabase credentials are added, this screen will convert to email magic links and OAuth providers while
            preserving these flows.
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

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Create or access your WalletHabit account</h1>
        <p className="text-sm text-slate-600">
          Use your email and a password to manage your customer account. Freemium accounts unlock the core modules while
          Stripe checkout prepares for future upgrades.
        </p>
      </header>

      {supabaseApp.status === 'error' && supabaseApp.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">We hit a snag loading account data.</p>
          <p>{supabaseApp.error}</p>
        </div>
      ) : null}

      {supabaseApp.session ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in</p>
          <p className="text-base font-semibold text-slate-900">{supabaseApp.session.user.email}</p>
          <p>
            Plan:{' '}
            <span className="font-medium text-brand">
              {supabaseApp.profile?.plan_tier ?? 'freemium'}
            </span>
          </p>
          <p>
            Head over to your{' '}
            <Link to="/account" className="font-semibold text-brand hover:text-brand-dark">
              account dashboard
            </Link>{' '}
            to review purchases and module access.
          </p>
          <button
            type="button"
            onClick={handleSupabaseSignOut}
            className="rounded-full border border-slate-300 px-5 py-2 text-xs font-semibold text-slate-600 transition hover:border-brand/50 hover:text-brand"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleSupabaseSignIn} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sign in</h2>
              <p className="text-sm text-slate-600">Access your customer account with your email and password.</p>
            </div>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={signInEmail}
                onChange={(event) => setSignInEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={signInPassword}
                onChange={(event) => setSignInPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            {signInError ? <p className="text-sm text-red-600">{signInError}</p> : null}
            <button
              type="submit"
              disabled={signInLoading}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
            >
              {signInLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <form onSubmit={handleSupabaseSignUp} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create a free account</h2>
              <p className="text-sm text-slate-600">Freemium accounts unlock budgeting, savings, and tracker modules.</p>
            </div>
            <label className="text-sm font-medium text-slate-700">
              Full name
              <input
                type="text"
                value={signUpName}
                onChange={(event) => setSignUpName(event.target.value)}
                required
                autoComplete="name"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={signUpEmail}
                onChange={(event) => setSignUpEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                value={signUpPassword}
                onChange={(event) => setSignUpPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </label>
            <fieldset className="space-y-3 rounded-xl border border-slate-200 p-4">
              <legend className="text-sm font-semibold text-slate-800">Choose your plan</legend>
              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="radio"
                  name="plan"
                  value="freemium"
                  checked={planChoice === 'freemium'}
                  onChange={() => setPlanChoice('freemium')}
                  className="mt-1"
                />
                <span>
                  <span className="font-semibold text-slate-900">Freemium (available now)</span>
                  <span className="block text-xs text-slate-500">Unlocks all free modules instantly.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-slate-400">
                <input type="radio" name="plan" value="stripe" disabled className="mt-1" />
                <span>
                  <span className="font-semibold">Pay via Stripe (coming soon)</span>
                  <span className="block text-xs">Checkout launches after we finalise premium packages.</span>
                </span>
              </label>
            </fieldset>
            {signUpError ? <p className="text-sm text-red-600">{signUpError}</p> : null}
            {signUpNotice ? <p className="text-sm text-brand">{signUpNotice}</p> : null}
            <button
              type="submit"
              disabled={signUpLoading}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-brand/40"
            >
              {signUpLoading ? 'Creating account…' : 'Create freemium account'}
            </button>
          </form>
        </div>
      )}

      <IntegrationStatus
        label="Supabase integration"
        ready={supabaseApp.isEnabled}
        description={
          supabaseApp.isEnabled
            ? 'Supabase is connected. Accounts, purchases, and module access sync in real time.'
            : 'Waiting on Supabase URL + anon key to land in the environment before wiring auth.'
        }
        guidance={supabaseEnvGuidance}
      />
    </div>
  )
}

