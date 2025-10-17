import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'
import AuthDialog from './AuthDialog'
import { useSupabaseApp } from '../lib/supabaseDataStore'

export default function DemoUserBadge() {
  const {
    state: { profile },
    isAuthenticated,
    signIn,
    signOut,
    toggleSkin,
  } = useDemoData()

  const supabaseApp = useSupabaseApp()
  const supabaseEnabled = supabaseApp.isEnabled
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false)

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  const supabaseSession = supabaseEnabled ? supabaseApp.session : null
  const isSignedIn = supabaseSession ? true : isAuthenticated

  const displayName = useMemo(() => {
    if (supabaseSession) {
      return (
        supabaseApp.profile?.full_name?.trim() ||
        (supabaseSession.user.user_metadata?.full_name as string | undefined)?.trim() ||
        supabaseSession.user.email ||
        'WalletHabit member'
      )
    }

    return profile.fullName
  }, [profile.fullName, supabaseApp.profile?.full_name, supabaseSession])

  const displayEmail = supabaseSession ? supabaseSession.user.email : profile.email
  const planTier = supabaseSession ? supabaseApp.profile?.plan_tier ?? 'freemium' : 'demo'

  useEffect(() => {
    if (supabaseSession) {
      setAuthDialogOpen(false)
    }
  }, [supabaseSession])

  const handleOpenAuth = () => {
    if (supabaseEnabled) {
      setAuthDialogOpen(true)
      return
    }

    signIn()
  }

  const handleSignOut = async () => {
    if (supabaseSession) {
      await supabaseApp.signOut()
      return
    }

    signOut()
  }

  if (!isSignedIn) {
    return (
      <div
        className={`flex items-center gap-3 rounded-full border px-3 py-2 text-xs shadow-sm transition-colors ${
          isUltimate ? 'border-[#d9cbb8] bg-[#fdf8f0] text-[#4a3a2d]' : 'border-slate-200 bg-white/80 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSkin}
            aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
            className={`flex h-5 w-5 items-center justify-center rounded-full p-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isUltimate
                ? 'text-[#5c7751] hover:text-[#4f6745] focus-visible:outline-[#5c7751]'
                : 'text-brand hover:text-brand-dark focus-visible:outline-brand'
            }`}
          >
            <span
              aria-hidden
              className={`block h-2.5 w-2.5 rounded-full transition-colors ${
                isUltimate ? 'bg-[#5c7751]' : 'bg-brand'
              }`}
            />
          </button>
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold uppercase tracking-[0.2em] ${
              isUltimate ? 'bg-[#e4d3bf] text-[#4f3826]' : 'bg-brand/15 text-brand-dark'
            }`}
          >
            {profile.initials}
          </span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className={`text-[13px] font-semibold ${
              isUltimate ? 'text-[#3b2d20]' : 'text-slate-900'
            }`}
          >
            Demo paused
          </span>
          <button
            type="button"
            onClick={handleOpenAuth}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition ${
              isUltimate ? 'bg-[#5c7751] hover:bg-[#4f6745]' : 'bg-brand hover:bg-brand-dark'
            }`}
          >
            Sign in
          </button>
        </div>
        <AuthDialog open={isAuthDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center gap-4 rounded-full border px-5 py-3 text-left text-sm shadow-md transition-colors ${
        isUltimate ? 'border-[#d9cbb8] bg-[#fdf8f0] text-[#4a3a2d]' : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSkin}
          aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
          className={`flex h-5 w-5 items-center justify-center rounded-full p-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isUltimate
              ? 'text-[#5c7751] hover:text-[#4f6745] focus-visible:outline-[#5c7751]'
              : 'text-brand hover:text-brand-dark focus-visible:outline-brand'
          }`}
        >
          <span
            aria-hidden
            className={`block h-2.5 w-2.5 rounded-full transition-colors ${
              isUltimate ? 'bg-[#5c7751]' : 'bg-brand'
            }`}
          />
        </button>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full px-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
            isUltimate ? 'bg-[#e4d3bf] text-[#4f3826]' : 'bg-brand/20 text-brand-dark'
          }`}
        >
          {profile.initials}
        </span>
      </div>
      <div className="flex items-center gap-4 whitespace-nowrap">
        <span
          className={`text-[14px] font-semibold ${isUltimate ? 'text-[#3b2d20]' : 'text-slate-900'}`}
        >
          {displayName}
        </span>
        {displayEmail ? (
          <span className={`text-[13px] ${isUltimate ? 'text-[#7a6a58]' : 'text-slate-500'}`}>{displayEmail}</span>
        ) : null}
        {supabaseSession ? (
          <>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                isUltimate ? 'bg-[#e6d8c6] text-[#5c7751]' : 'bg-brand/10 text-brand'
              }`}
            >
              {planTier}
            </span>
            <Link
              to="/account"
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                isUltimate
                  ? 'border border-[#d9cbb8] text-[#5c7751] hover:border-[#c9b79f] hover:text-[#4f6745]'
                  : 'border border-brand/30 text-brand hover:border-brand hover:text-brand-dark'
              }`}
            >
              Account
            </Link>
          </>
        ) : (
          <Link
            to="/account"
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
              isUltimate
                ? 'border border-[#d9cbb8] text-[#5c7751] hover:border-[#c9b79f] hover:text-[#4f6745]'
                : 'border border-brand/30 text-brand hover:border-brand hover:text-brand-dark'
            }`}
          >
            Account
          </Link>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className={`text-[12px] font-semibold transition ${
            isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
          }`}
        >
          Sign out
        </button>
      </div>
      <AuthDialog open={isAuthDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </div>
  )
}
