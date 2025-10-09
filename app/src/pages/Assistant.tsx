import { useMemo, useState } from 'react'

type ConversationRole = 'user' | 'assistant'

type ConversationMessage = {
  id: string
  role: ConversationRole
  content: string
}

type PromptScript = {
  id: string
  label: string
  summary: string
  scenario: string
}

const promptScripts: PromptScript[] = [
  {
    id: 'weekly-reflection',
    label: 'Weekly reflection',
    summary: 'Recap spending, celebrate wins, and set next intentions.',
    scenario: 'You want a guided weekly check-in that surfaces highlights and suggests small nudges.',
  },
  {
    id: 'budget-troubleshoot',
    label: 'Budget troubleshoot',
    summary: 'Diagnose overspending envelopes and recommend fixes.',
    scenario: 'A few envelopes are consistently over target and you want help to rebalance.',
  },
  {
    id: 'savings-sprint',
    label: 'Savings sprint',
    summary: 'Boost contributions toward a priority goal.',
    scenario: 'You need to accelerate the "Move-in fund" goal over the next 60 days.',
  },
]

const conversationScripts: Record<string, ConversationMessage[]> = {
  'weekly-reflection': [
    {
      id: 'assistant-1',
      role: 'assistant',
      content:
        "Hey there! Here's your gentle weekly reset: you're under budget on dining by $42 and hit 85% of your savings autopilot. Want a quick win to lock in?",
    },
    {
      id: 'user-1',
      role: 'user',
      content: "Yes please — what's one habit I should keep and one tweak to try?",
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content:
        'Keep celebrating that meal prep routine — it saved $60 this week. For next week, shift $25 from entertainment into emergency savings so the buffer keeps growing.',
    },
    {
      id: 'assistant-3',
      role: 'assistant',
      content:
        'Want me to draft a short journal recap you can pin to your dashboard focus card?',
    },
  ],
  'budget-troubleshoot': [
    {
      id: 'user-1',
      role: 'user',
      content: 'Groceries keeps bursting past the envelope. Can you help me calm that down?',
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      content:
        "Absolutely. Trend check: Groceries averaged $520/mo vs a $450 target. Meal kits and weekend treats were the biggest swings. Want to explore two re-balance options?",
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content:
        'Option A: lift the envelope to $500 and trim Dining Out by $40. Option B: keep $450, but schedule a mid-week pantry check reminder so you shop with a tighter list.',
    },
    {
      id: 'user-2',
      role: 'user',
      content: "Let's try Option B and keep the target for now.",
    },
    {
      id: 'assistant-3',
      role: 'assistant',
      content:
        'Great! I will add a Wednesday reminder and highlight swap candidates in your next dashboard review.',
    },
  ],
  'savings-sprint': [
    {
      id: 'assistant-1',
      role: 'assistant',
      content:
        'Sprint mode ready. Move-in fund is at 62% with $2,400 left. Three upcoming paychecks average $1,400. Want ideas to fast-track the next $600?',
    },
    {
      id: 'user-1',
      role: 'user',
      content: 'Yes — what combos get me there in 6 weeks?',
    },
    {
      id: 'assistant-2',
      role: 'assistant',
      content:
        'Playbook: (1) Divert $120 from low-priority envelopes, (2) add a one-time $150 transfer from cash cushion, (3) commit to a $70 side gig deposit. That stacks to $610.',
    },
    {
      id: 'assistant-3',
      role: 'assistant',
      content:
        'Need a motivational script or accountability reminder for the side gig milestone?',
    },
  ],
}

const foundations = [
  {
    title: 'Context aware',
    description:
      'Copilot will reference envelopes, goals, and transactions once Supabase auth and syncing go live.',
  },
  {
    title: 'Action forward',
    description: 'Responses nudge toward a tiny next step, not just a summary.',
  },
  {
    title: 'Privacy first',
    description: 'AI access honors encryption-at-rest and transparent data usage policies.',
  },
]

const roadmap = [
  {
    label: 'Auth-linked insights',
    status: 'Queued — post Supabase session wiring',
  },
  {
    label: 'Voice note capture',
    status: 'Exploring — transcription via Whisper API',
  },
  {
    label: 'Pro plan nudges',
    status: 'Planned — gated templates and accountability streaks',
  },
]

export default function Assistant() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(promptScripts[0].id)
  const [notes, setNotes] = useState('')

  const activePrompt = useMemo(
    () => promptScripts.find((prompt) => prompt.id === selectedPromptId) ?? promptScripts[0],
    [selectedPromptId],
  )

  const activeConversation = conversationScripts[activePrompt.id]

  return (
    <div className="flex flex-1 flex-col gap-10">
      <header className="rounded-3xl border border-slate-200 bg-white px-8 py-8 shadow-sm">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
          AI helper preview
        </span>
        <h1 className="mt-3 text-3xl font-bold">WalletHabit Copilot lab</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Try the conversational skeleton that will power AI nudges across the app. Real-time data
          will pipe in once Supabase profiles, budgets, and goals sync to the Copilot brain.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Prompt library
            </span>
            <div className="flex flex-wrap gap-2">
              {promptScripts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => setSelectedPromptId(prompt.id)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-semibold transition',
                    selectedPromptId === prompt.id
                      ? 'border-brand/50 bg-brand/10 text-brand'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-200 hover:text-slate-800',
                  ].join(' ')}
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">Scenario</p>
            <p className="mt-1 text-slate-600">{activePrompt.summary}</p>
            <p className="mt-1 italic text-slate-500">{activePrompt.scenario}</p>
          </div>

          <div className="mt-6 space-y-4">
            {activeConversation.map((message) => (
              <div
                key={message.id}
                className={[
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start',
                ].join(' ')}
              >
                <div
                  className={[
                    'max-w-lg rounded-2xl border px-4 py-3 text-sm shadow-sm',
                    message.role === 'assistant'
                      ? 'border-brand/30 bg-brand/10 text-brand-dark'
                      : 'border-slate-200 bg-white text-slate-700',
                  ].join(' ')}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {message.role === 'assistant' ? 'Copilot' : 'You'}
                  </p>
                  <p className="mt-2 leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            <label htmlFor="copilot-notes" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Jot down next actions
            </label>
            <textarea
              id="copilot-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Capture commitments, follow-ups, or reminders Copilot should send once automation lands."
              className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
            />
            <p className="text-xs text-slate-500">
              These notes stay local for now. Soon they will sync with Supabase and power automated follow-ups.
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-3xl border border-brand/30 bg-brand/10 p-6 text-sm text-brand-dark">
          <h2 className="text-base font-semibold">Copilot foundations</h2>
          <ul className="space-y-3">
            {foundations.map((item) => (
              <li key={item.title} className="rounded-2xl border border-brand/20 bg-white/60 p-4 text-brand-dark">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-brand-dark/80">{item.description}</p>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-brand/20 bg-white/70 p-4">
            <h3 className="text-sm font-semibold text-brand-dark">Build timeline</h3>
            <ul className="mt-3 space-y-2 text-xs">
              {roadmap.map((item) => (
                <li key={item.label} className="flex flex-col rounded-xl border border-brand/20 bg-brand/5 px-3 py-2">
                  <span className="font-semibold text-brand-dark">{item.label}</span>
                  <span className="text-brand-dark/80">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-brand/40 bg-brand/5 p-4 text-xs">
            <p className="font-semibold text-brand-dark">Coming soon</p>
            <p className="mt-1 text-brand-dark/80">
              Hook this experience into live chat, suggested automations, and contextual insights right inside Budget and
              Goals pages once Supabase data arrives.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {promptScripts.map((prompt) => (
          <article
            key={prompt.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Prompt spotlight</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">{prompt.label}</h3>
            <p className="mt-2 leading-relaxed">{prompt.summary}</p>
            <p className="mt-3 text-xs text-slate-500">Tap the chip above to see how Copilot responds today.</p>
          </article>
        ))}
      </section>
    </div>
  )
}
