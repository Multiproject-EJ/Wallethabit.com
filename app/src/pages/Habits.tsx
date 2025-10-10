const habits = [
  {
    title: 'Weekly money reflection',
    focus: 'Awareness',
    description:
      'Spend ten minutes each Sunday scanning cash flow, debt balances, and one win to keep your narrative positive.',
    stars: 4.9,
    votes: 287,
  },
  {
    title: 'Automatic savings sweep',
    focus: 'Wealth building',
    description:
      'Auto-transfer a fixed amount after payday so your goals grow before spending even starts.',
    stars: 4.7,
    votes: 245,
  },
  {
    title: 'Inbox zero for bills',
    focus: 'Organization',
    description:
      'Tag and clear billing emails every Thursday night, logging anything that needs negotiation inside WalletHabit.',
    stars: 4.6,
    votes: 198,
  },
  {
    title: 'Monthly partner money date',
    focus: 'Connection',
    description:
      'Swap updates, align on next focus, and celebrate the streaks you are maintaining together.',
    stars: 4.8,
    votes: 173,
  },
  {
    title: 'Friday feedback loop',
    focus: 'Improvement',
    description:
      'Review your nudges, note what worked, and submit quick ideas to the community for refinements.',
    stars: 4.5,
    votes: 152,
  },
]

const categories = [
  {
    title: 'Focus on what matters',
    description:
      'Browse the library by goal, life stage, or how much time you actually have. The community tags new rituals so you can jump straight to what resonates.',
  },
  {
    title: 'Vote with community stars',
    description:
      'Tap the star button to show love for a habit that keeps you consistent. Top performers get deeper guides, templates, and habit stacking ideas.',
  },
  {
    title: 'Submit your rituals',
    description:
      'Share the practices that changed everything. We review, polish, and then release them to the library with full credit.',
  },
]

export default function Habits() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Habit library
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Discover rituals the community swears by.
            </h1>
            <p className="text-lg text-navy/70">
              WalletHabit members log their wins, and the brightest routines float to the top. Browse ideas, cast your star
              rating, and stack habits that keep your financial life calm.
            </p>
            <ul className="space-y-3 text-sm text-navy/80">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-600">★</span>
                <span>Every habit shows real community stars so you can see what actually sticks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-600">★</span>
                <span>Filter by focus or time investment to build a realistic routine.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-emerald-600">★</span>
                <span>Got a ritual that works? Submit it and let the community star it up.</span>
              </li>
            </ul>
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/70 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700/80">How the library grows</h2>
            <ul className="space-y-4 text-sm text-navy/70">
              {categories.map((category) => (
                <li key={category.title} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-base font-semibold text-navy">{category.title}</p>
                  <p className="mt-1 text-sm text-navy/70">{category.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-navy">Community starboard</h2>
          <p className="text-sm text-navy/70">
            Star counts update every hour so you always know what is resonating right now.
          </p>
        </div>
        <ul className="grid gap-4 lg:grid-cols-2">
          {habits.map((habit) => (
            <li key={habit.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600/80">{habit.focus}</span>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
                    </svg>
                    {habit.stars.toFixed(1)} community stars
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy">{habit.title}</h3>
                <p className="text-sm text-navy/70">{habit.description}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-navy/70">
                <p>{habit.votes} members have voted on this habit.</p>
                <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-4 py-2 font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
                  </svg>
                  Add your star
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

