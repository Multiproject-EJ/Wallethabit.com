import { FormEvent, useEffect, useMemo, useState } from 'react'

import { useSupabaseApp } from '../lib/supabaseDataStore'

type AuthDialogProps = {
  open: boolean
  onClose: () => void
}

type AuthTab = 'sign-in' | 'sign-up'

export default function AuthDialog({ open, onClose }: AuthDialogProps) {
  const supabaseApp = useSupabaseApp()

  const [activeTab, setActiveTab] = useState<AuthTab>('sign-in')

  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState<string | null>(null)
  const [signInLoading, setSignInLoading] = useState(false)

  const [signUpName, setSignUpName] = useState('')
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpNotice, setSignUpNotice] = useState<string | null>(null)
  const [signUpLoading, setSignUpLoading] = useState(false)

  const isEnabled = supabaseApp.isEnabled

  useEffect(() => {
    if (!open) {
      setActiveTab('sign-in')
      setSignInEmail('')
      setSignInPassword('')
      setSignInError(null)
      setSignInLoading(false)
      setSignUpName('')
      setSignUpEmail('')
      setSignUpPassword('')
      setSignUpError(null)
      setSignUpNotice(null)
      setSignUpLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open && supabaseApp.session) {
      onClose()
    }
  }, [open, onClose, supabaseApp.session])

  const statusMessage = useMemo(() => {
    if (!supabaseApp.status || supabaseApp.status === 'idle') {
      return null
    }

    if (supabaseApp.status === 'error' && supabaseApp.error) {
      return supabaseApp.error
    }

    if (supabaseApp.status === 'loading') {
      return 'Loading account data…'
    }

    return null
  }, [supabaseApp.error, supabaseApp.status])

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

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6">
      <div className="fixed inset-0 bg-slate-900/60" aria-hidden onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 my-6 w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex max-h-[calc(100vh-6rem)] flex-col gap-6 overflow-y-auto p-8 sm:max-h-[calc(100vh-4rem)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Access your WalletHabit account</h2>
              <p className="text-sm text-slate-600">
                Sign in to continue or create a freemium account to unlock the core modules instantly.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            >
              Close
            </button>
          </div>

        {!isEnabled ? (
          <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">
            <p className="font-semibold">Supabase authentication is not configured.</p>
            <p>
              Add your project credentials to <code className="font-mono">.env</code> before launching the live sign-in experience.
            </p>
          </div>
        ) : (
          <>
            {statusMessage ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {statusMessage}
              </div>
            ) : null}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('sign-in')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === 'sign-in'
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sign-up')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === 'sign-up'
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Create account
              </button>
            </div>

            {activeTab === 'sign-in' ? (
              <form onSubmit={handleSupabaseSignIn} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Sign in</h3>
                  <p className="text-sm text-slate-600">Use your email address and password to continue.</p>
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
            ) : (
              <form onSubmit={handleSupabaseSignUp} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Create a freemium account</h3>
                  <p className="text-sm text-slate-600">Unlock budgeting, savings, and tracker modules instantly.</p>
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
            )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}

