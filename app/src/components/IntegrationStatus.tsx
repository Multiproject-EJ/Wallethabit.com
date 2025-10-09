import type { ReactNode } from 'react'

type IntegrationStatusProps = {
  icon?: ReactNode
  label: string
  ready: boolean
  description: string
  guidance: string[]
}

export default function IntegrationStatus({ icon, label, ready, description, guidance }: IntegrationStatusProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
          {icon ?? <span className="text-lg">•</span>}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-base font-semibold text-slate-900">{ready ? 'Ready for secrets' : 'Waiting on secrets'}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
      </header>
      <ul className="mt-4 space-y-2 text-xs text-slate-500">
        {guidance.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
