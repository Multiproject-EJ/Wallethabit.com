const quickWidgets = [
  {
    label: 'Today\'s mood',
    amount: '+£128',
    caption: 'Left to route',
    tone: 'positive',
  },
  {
    label: 'Habit score',
    amount: '82',
    caption: '▲ 4 this week',
    tone: 'neutral',
  },
  {
    label: 'Bills due',
    amount: '2',
    caption: 'Both scheduled',
    tone: 'warning',
  },
  {
    label: 'Stash boost',
    amount: '+£45',
    caption: 'Lunch round-up',
    tone: 'positive',
  },
]

const budgetTiles = [
  {
    name: 'Food & drink',
    amount: '£58.40',
    accent: 'Spent £12 today',
    color: 'from-[#ffd976] to-[#f7ad4b] text-[#5c3700]',
  },
  {
    name: 'Transport',
    amount: '£24.10',
    accent: '3 rides logged',
    color: 'from-[#8ae8ff] to-[#4bb7ff] text-[#044563]',
  },
  {
    name: 'Health care',
    amount: '£36.00',
    accent: 'Next refill Tue',
    color: 'from-[#a2f0c1] to-[#5ccd92] text-[#094f2a]',
  },
  {
    name: 'Personal care',
    amount: '£18.75',
    accent: 'Self-care fund',
    color: 'from-[#f6b0ff] to-[#c985ff] text-[#4c0c68]',
  },
]

const keypadRows = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['C', '0', '✓'],
]

const memberShares = [
  {
    name: 'Adam',
    role: 'Owner',
    color: 'bg-gradient-to-br from-[#ffd976] to-[#f7ad4b] text-[#5c3700]',
  },
  {
    name: 'Linda',
    role: 'Editor',
    color: 'bg-gradient-to-br from-[#8ae8ff] to-[#4bb7ff] text-[#044563]',
  },
  {
    name: 'Ruth',
    role: 'Viewer',
    color: 'bg-gradient-to-br from-[#f6b0ff] to-[#c985ff] text-[#4c0c68]',
  },
]

const featureHighlights = [
  {
    title: 'Clickable widgets',
    description:
      'Tap any tile to zoom into the ritual, reassign envelopes, or capture a quick voice note. Widgets pulse when something needs you.',
    points: ['Budget cards animate open', 'Hold to pin a focus stack', 'Double-tap to celebrate wins'],
    accent: 'bg-primary/10 border-primary/40',
  },
  {
    title: 'App-like navigation',
    description:
      'Bottom tabs snap you between Home, Accounts, Transactions, Stats, and Settings. Micro-transitions keep the experience buttery.',
    points: ['Persistent nav bar', 'Haptics-ready states', 'Dark-friendly palette'],
    accent: 'bg-gold/10 border-gold/40',
  },
  {
    title: 'Instant sharing',
    description:
      'Invite a partner or coach, toggle permissions, and beam highlights straight into your shared ritual log.',
    points: ['Role-based invites', 'Context aware comments', 'Timeline export to PDF'],
    accent: 'bg-emerald-100/50 border-emerald-300/60',
  },
]

const flowMoments = [
  {
    heading: 'Morning check-in',
    copy: 'Swipe down to surface nudges, knock out quick logs, and confirm today\'s plan before breakfast.',
  },
  {
    heading: 'Midday capture',
    copy: 'Snap receipts, assign merchants, and let WalletHabit auto-categorise the spend into your envelope system.',
  },
  {
    heading: 'Evening share',
    copy: 'Drop a voice memo recap, ship the momentum graph to your partner, and roll over what is left into tomorrow.',
  },
]

export default function MobileModule() {
  return (
    <div className="flex flex-1 flex-col gap-16 pb-20">
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#fff3c8] via-white to-[#ffe6ff] px-8 py-14 text-navy shadow-lg sm:px-12">
        <div className="pointer-events-none absolute -left-32 top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#ffb3ff]/40 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-40 w-40 rounded-full bg-gold/40 blur-3xl" aria-hidden />

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr),420px] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              📱 Mobile ritual module
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              WalletHabit that feels made for your phone, not just shrunk to fit.
            </h1>
            <p className="max-w-2xl text-base text-navy/70">
              Launch the mobile module to carry every ritual, envelope, and celebration with you. Designed for thumb-friendly interactions,
              silky scroll, and quick logging on the go.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-white shadow-sm transition hover:bg-primary-dark"
              >
                Preview mobile flow
                <span aria-hidden>→</span>
              </button>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-wide text-primary/80">
                Offline ready · Syncs instantly
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl" aria-hidden />
            <div className="absolute -right-8 top-10 h-20 w-20 rounded-full bg-[#ffb3ff]/40 blur-2xl" aria-hidden />
            <div className="relative rounded-[46px] border border-white/60 bg-gradient-to-br from-white/80 to-white/60 p-4 shadow-[0_30px_60px_rgba(31,42,68,0.18)] backdrop-blur">
              <div className="flex items-center justify-between rounded-[32px] bg-white/70 px-5 py-3 text-[0.65rem] font-semibold text-slate-500">
                <span>14:28</span>
                <div className="flex items-center gap-1 text-[0.6rem]">
                  <span className="inline-flex h-4 w-6 items-center justify-center rounded-full bg-slate-200 text-[0.55rem] text-slate-600">4G</span>
                  <span className="h-3 w-5 rounded-sm bg-slate-300" aria-hidden />
                  <span className="h-3 w-5 rounded-sm bg-slate-400" aria-hidden />
                </div>
              </div>

              <div className="mt-4 space-y-4 rounded-[32px] bg-white/85 p-5">
                <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white shadow-inner">
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/80">
                    <span>Budget pulse</span>
                    <span>Week 24</span>
                  </div>
                  <p className="mt-3 text-3xl font-semibold">£23,835</p>
                  <p className="text-xs text-white/80">Habit score +6 vs last week</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {quickWidgets.map((widget) => (
                    <div
                      key={widget.label}
                      className={`flex flex-col gap-1 rounded-2xl border border-white/60 bg-white/90 p-3 text-left text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                        widget.tone === 'positive'
                          ? 'text-emerald-700'
                          : widget.tone === 'warning'
                          ? 'text-amber-700'
                          : 'text-navy/80'
                      }`}
                    >
                      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-navy/60">{widget.label}</span>
                      <span className="text-lg font-semibold text-navy">{widget.amount}</span>
                      <span className="text-[0.7rem] text-navy/60">{widget.caption}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {budgetTiles.map((tile) => (
                    <div
                      key={tile.name}
                      className={`rounded-3xl bg-gradient-to-br ${tile.color} p-3 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg`}
                    >
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-white/80">{tile.name}</p>
                      <p className="mt-1 text-lg font-semibold text-white">{tile.amount}</p>
                      <p className="text-[0.7rem] text-white/80">{tile.accent}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-4 text-navy/80">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-navy/50">
                    <span>Quick log</span>
                    <span>Budget · £150</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold">
                    {keypadRows.map((row) =>
                      row.map((key) => (
                        <button
                          key={key}
                          type="button"
                          className={`flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition active:scale-95 ${
                            key === 'C'
                              ? 'text-amber-600'
                              : key === '✓'
                              ? 'bg-primary text-white border-primary'
                              : 'text-navy'
                          }`}
                        >
                          {key}
                        </button>
                      )),
                    )}
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-primary/30 bg-primary/5 p-4 text-xs text-navy/70">
                  <div className="flex items-center justify-between font-semibold text-primary">
                    <span>Members</span>
                    <span className="text-[0.65rem] uppercase tracking-wide text-primary/70">Share</span>
                  </div>
                  <ul className="space-y-2">
                    {memberShares.map((member) => (
                      <li key={member.name} className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/90 p-3 text-navy">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${member.color}`}>
                          {member.name[0]}
                        </span>
                        <span className="text-sm font-semibold">{member.name}</span>
                        <span className="text-[0.6rem] uppercase tracking-wide text-navy/50">{member.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-sm lg:grid-cols-3">
        {featureHighlights.map((feature) => (
          <article
            key={feature.title}
            className={`flex h-full flex-col gap-4 rounded-3xl border bg-white/90 p-6 text-navy shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${feature.accent}`}
          >
            <h2 className="text-xl font-semibold text-navy">{feature.title}</h2>
            <p className="text-sm text-navy/70">{feature.description}</p>
            <ul className="mt-auto space-y-2 text-sm text-navy/70">
              {feature.points.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Daily rhythm
            </span>
            <h2 className="text-3xl font-semibold text-navy">A full ritual loop in three gentle swipes</h2>
            <p className="max-w-xl text-sm text-navy/70">
              The mobile module keeps the same calm cadence you love on desktop, tuned for lighter pockets of time. Every swipe reveals
              what matters now, while the background sync keeps your dashboards updated.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-navy/70 sm:grid-cols-3">
            {flowMoments.map((moment) => (
              <div key={moment.heading} className="flex h-full flex-col gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">{moment.heading}</p>
                <p className="text-sm text-navy/80">{moment.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-navy via-primary-dark to-midnight p-10 text-white shadow-lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr),320px] lg:items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold leading-tight">Ready when you are</h2>
            <p className="text-sm text-white/80">
              Roll the mobile module into your workspace to unlock offline habit logging, richer share cards, and effortless thumb-only flows.
              We will keep iterating with community feedback.
            </p>
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-navy transition hover:bg-white/90"
              >
                Add to my modules
                <span aria-hidden>+</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-2 text-white transition hover:bg-white/10"
              >
                View roadmap
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/10 p-6 text-sm text-white/80 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Release notes</p>
            <ul className="mt-4 space-y-3">
              <li className="rounded-2xl bg-white/10 p-3">
                <p className="text-sm font-semibold text-white">v0.9.0 · Fluid widgets</p>
                <p className="text-xs text-white/70">Budget cards now stretch with your swipe to reveal deeper stats.</p>
              </li>
              <li className="rounded-2xl bg-white/10 p-3">
                <p className="text-sm font-semibold text-white">v0.9.0 · Offline rituals</p>
                <p className="text-xs text-white/70">Log habits without a signal. We sync in the background when you reconnect.</p>
              </li>
              <li className="rounded-2xl bg-white/10 p-3">
                <p className="text-sm font-semibold text-white">Coming soon</p>
                <p className="text-xs text-white/70">Shared inbox for receipts, notification settings per module, and watch companion.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
