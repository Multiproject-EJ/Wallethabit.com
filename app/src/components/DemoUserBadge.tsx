import { Link } from 'react-router-dom'

import { useDemoData } from '../lib/demoDataStore'

export default function DemoUserBadge() {
  const {
    state: { profile },
    isAuthenticated,
    signIn,
    signOut,
  } = useDemoData()

  const handleToggleSession = () => {
    if (isAuthenticated) {
      signOut()
    } else {
      signIn()
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-3 py-2 text-left text-xs shadow-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand-dark">
        {profile.initials}
      </div>
      <div className="hidden sm:flex sm:flex-col">
        <span className="text-[13px] font-semibold text-slate-900">{profile.fullName}</span>
        <span className="text-[11px] text-slate-500">{profile.email}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
          {isAuthenticated ? 'Demo active' : 'Signed out'}
        </span>
        <button
          type="button"
          onClick={handleToggleSession}
          className="text-[11px] font-semibold text-brand transition hover:text-brand-dark"
        >
          {isAuthenticated ? 'Sign out' : 'Resume demo'}
        </button>
      </div>
      <Link
        to="/settings"
        className="hidden rounded-full border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-brand/50 hover:text-brand md:inline-flex"
      >
        Settings
      </Link>
    </div>
  )
}
