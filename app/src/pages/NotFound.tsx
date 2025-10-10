import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
        <h1 className="text-3xl font-bold text-slate-900">This page is still being budgeted.</h1>
        <p className="max-w-md text-sm text-slate-600">
          We either moved this page or it’s part of a future milestone. Head back to the setup guide to stay in the loop.
        </p>
      </div>
      <Link
        to="/start"
        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand/60 hover:text-brand"
      >
        Return to setup
      </Link>
    </div>
  )
}
