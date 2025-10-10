const ideas = [
  {
    title: 'Shared accountability circles',
    description:
      'Pair up with other members pursuing similar goals, share weekly check-ins, and celebrate milestones together.',
    votes: 186,
    status: 'Gathering interest',
  },
  {
    title: 'Automated bill negotiation alerts',
    description:
      'Surface community-tested negotiation scripts and ping you when an expiring promo needs a refresh.',
    votes: 154,
    status: 'In discovery',
  },
  {
    title: 'Habit streak party mode',
    description:
      'Unlock confetti, audio cues, and shoutouts inside the app when your streak crosses community milestones.',
    votes: 129,
    status: 'Prototype ready',
  },
]

const channels = [
  {
    title: 'Feature voting',
    description:
      'Skim what the community wants next, upvote your favourites, and add quick notes so the team knows why it matters.',
  },
  {
    title: 'Quarterly roadmap live sessions',
    description:
      'Join the product team for walk-throughs of what shipped, what stalled, and what needs more real-world stories.',
  },
  {
    title: 'Founder office hours',
    description:
      'Bring your toughest questions or dream ideas. We spotlight high-impact submissions straight from these calls.',
  },
]

export default function Community() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-16">
      <section className="rounded-3xl border border-slate-200 bg-white px-8 py-12 shadow-sm sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Community hub
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Vote, share feedback, and shape WalletHabit with us.
            </h1>
            <p className="text-lg text-navy/70">
              This space keeps our roadmap transparent. Browse ideas that are climbing the charts, cast your vote, and drop
              quick feedback so the crew knows what support looks like for you.
            </p>
            <ul className="space-y-3 text-sm text-navy/80">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">★</span>
                <span>Votes power progress — the more stars an idea earns, the faster it moves into build mode.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">★</span>
                <span>Found something missing? Submit a fresh pitch and watch the community rally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-primary">★</span>
                <span>Monthly recaps highlight the top-voted features and what shipped because of them.</span>
              </li>
            </ul>
          </div>
          <div className="grid w-full max-w-md gap-4 rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary/80">How to plug in</h2>
            <ul className="space-y-4 text-sm text-navy/70">
              {channels.map((channel) => (
                <li key={channel.title} className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm">
                  <p className="text-base font-semibold text-navy">{channel.title}</p>
                  <p className="mt-1 text-sm text-navy/70">{channel.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-navy">Trending ideas</h2>
          <p className="text-sm text-navy/70">
            Upvote the ideas that unlock more momentum for you. We refresh the leaderboard every Friday and send a recap to
            everyone who participated.
          </p>
          <ul className="space-y-4">
            {ideas.map((idea) => (
              <li key={idea.title} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">{idea.status}</p>
                  <p className="text-lg font-semibold text-navy">{idea.title}</p>
                  <p className="text-sm text-navy/70">{idea.description}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z" />
                  </svg>
                  {idea.votes} stars
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-5 rounded-3xl border border-dashed border-primary/40 bg-gradient-to-br from-white via-primary/5 to-primary/20 p-6 text-sm text-navy/80">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">What happens with your vote?</h3>
          <p>
            We review the leaderboard weekly, fold insights into the roadmap, and add progress tags so you see movement in
            real-time.
          </p>
          <p>
            When an idea moves to build, you can opt into early testing circles and share feedback before anyone else sees it.
          </p>
          <p>
            Every quarter we highlight community-led wins and shout out the most helpful contributors.
          </p>
        </div>
      </section>
    </div>
  )
}

