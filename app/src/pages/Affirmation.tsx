import { useEffect } from 'react'

export default function Affirmation() {
  useEffect(() => {
    window.location.replace('/affirmations/')
  }, [])

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-slate-900">Redirecting…</h1>
      <p className="mt-4 text-base text-slate-600">
        If you are not redirected automatically,{' '}
        <a className="text-sky-600 underline" href="/affirmations/">
          open WalletHabit Affirmations
        </a>
        .
      </p>
    </div>
  )
}
