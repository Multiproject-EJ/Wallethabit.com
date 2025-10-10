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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs shadow-sm">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          {profile.initials}
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[13px] font-semibold text-slate-900">Demo paused</span>
          <button
            type="button"
            onClick={handleToggleSession}
            className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark"
          >
            Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-white px-5 py-3 text-left text-sm shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand-dark">
        {profile.initials}
      </div>
      <div className="flex items-center gap-4 whitespace-nowrap">
        <span className="text-[14px] font-semibold text-slate-900">{profile.fullName}</span>
        <span className="text-[13px] text-slate-500">{profile.email}</span>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
          Demo active
        </span>
        <button
          type="button"
          onClick={handleToggleSession}
          className="text-[12px] font-semibold text-brand transition hover:text-brand-dark"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
