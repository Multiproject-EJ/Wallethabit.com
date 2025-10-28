import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [isMobileActionMenuOpen, setMobileActionMenuOpen] = useState(false)
  const badgeRef = useRef<HTMLDivElement | null>(null)

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

  const planTier = supabaseSession ? supabaseApp.profile?.plan_tier ?? 'freemium' : 'demo'
  const communityUrl = '/community'

  useEffect(() => {
    if (supabaseSession) {
      setAuthDialogOpen(false)
    }
  }, [supabaseSession])

  useEffect(() => {
    if (!isMobileActionMenuOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!badgeRef.current?.contains(event.target as Node)) {
        setMobileActionMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileActionMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileActionMenuOpen])

  const handleOpenAuth = () => {
    if (supabaseEnabled) {
      setAuthDialogOpen(true)
      return
    }

    signIn()
  }

  const handleSignOut = async () => {
    setMobileActionMenuOpen(false)
    if (supabaseSession) {
      await supabaseApp.signOut()
      return
    }

    signOut()
  }

  if (!isSignedIn) {
    return (
      <div className="relative">
        <div
          className={`hidden w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full border px-3 py-2 text-xs shadow-sm transition-colors sm:flex sm:w-auto sm:flex-nowrap sm:gap-3 ${
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
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:flex-nowrap sm:gap-2 sm:whitespace-nowrap">
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
              className={`flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition ${
                isUltimate ? 'bg-[#5c7751] hover:bg-[#4f6745]' : 'bg-brand hover:bg-brand-dark'
              }`}
            >
              Sign in
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleSkin}
            aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
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
          <button
            type="button"
            onClick={handleOpenAuth}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isUltimate
                ? 'bg-[#5c7751] text-white hover:bg-[#4f6745] focus-visible:outline-[#5c7751]'
                : 'bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand'
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-white/20">
              {profile.initials}
            </span>
            <span>Sign in</span>
          </button>
        </div>
        <AuthDialog open={isAuthDialogOpen} onClose={() => setAuthDialogOpen(false)} />
      </div>
    )
  }

  const expandableDesktopItemClass =
    'hidden sm:group-hover:flex sm:group-focus-within:flex sm:transition sm:duration-150 sm:ease-out'

  const accountLinkClass = `flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
    isUltimate
      ? 'border border-[#d9cbb8] text-[#5c7751] hover:border-[#c9b79f] hover:text-[#4f6745]'
      : 'border border-brand/30 text-brand hover:border-brand hover:text-brand-dark'
  }`

  return (
    <div ref={badgeRef} className="relative">
      <div
        className={`group hidden w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-full border px-5 py-3 text-left text-sm shadow-md transition-colors sm:flex sm:w-auto sm:flex-nowrap sm:gap-4 ${
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
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-4 sm:whitespace-nowrap">
          <span
            className={`${expandableDesktopItemClass} w-full text-[14px] font-semibold sm:w-auto sm:items-center ${
              isUltimate ? 'text-[#3b2d20]' : 'text-slate-900'
            }`}
          >
            {displayName}
          </span>
          <Link
            to={communityUrl}
            className={`flex-shrink-0 text-[13px] font-semibold transition ${
              isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
            }`}
          >
            Community FAQ
          </Link>
          {supabaseSession && (
            <span
              className={`${expandableDesktopItemClass} flex-shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                isUltimate ? 'bg-[#e6d8c6] text-[#5c7751]' : 'bg-brand/10 text-brand'
              }`}
            >
              {planTier}
            </span>
          )}
          <Link to="/account" className={accountLinkClass}>
            Account
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className={`${expandableDesktopItemClass} flex-shrink-0 text-[12px] font-semibold transition ${
              isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
            }`}
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 sm:hidden">
        <button
          type="button"
          onClick={toggleSkin}
          aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
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
        <button
          type="button"
          aria-expanded={isMobileActionMenuOpen}
          aria-haspopup="true"
          onClick={() => setMobileActionMenuOpen((open) => !open)}
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isUltimate
              ? 'bg-[#e4d3bf] text-[#4f3826] focus-visible:outline-[#5c7751]'
              : 'bg-brand/20 text-brand-dark focus-visible:outline-brand'
          }`}
        >
          {profile.initials}
        </button>
        {isMobileActionMenuOpen && (
          <div
            className={`absolute right-0 top-full z-30 mt-3 w-[min(18rem,85vw)] rounded-3xl border shadow-xl ${
              isUltimate
                ? 'border-[#e0d1bd] bg-[#fef9f3] text-[#4a3a2d]'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-wide ${
                    isUltimate ? 'bg-[#e4d3bf] text-[#4f3826]' : 'bg-brand/20 text-brand-dark'
                  }`}
                >
                  {profile.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName}</p>
                  {supabaseSession && (
                    <span
                      className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                        isUltimate ? 'bg-[#e6d8c6] text-[#5c7751]' : 'bg-brand/10 text-brand'
                      }`}
                    >
                      {planTier}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`flex flex-col text-[13px] font-semibold ${
                  isUltimate ? 'divide-[#e8dccc]' : 'divide-slate-200/70'
                } divide-y`}
              >
                <Link
                  to={communityUrl}
                  onClick={() => setMobileActionMenuOpen(false)}
                  className={`px-0 py-2 transition ${
                    isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
                  }`}
                >
                  Community FAQ
                </Link>
                <Link
                  to="/account"
                  onClick={() => setMobileActionMenuOpen(false)}
                  className={`px-0 py-2 transition ${
                    isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
                  }`}
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={`text-left px-0 py-2 transition ${
                    isUltimate ? 'text-[#5c7751] hover:text-[#4f6745]' : 'text-brand hover:text-brand-dark'
                  }`}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AuthDialog open={isAuthDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </div>
  )
}
