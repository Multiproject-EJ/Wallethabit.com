import { FormEvent } from 'react'

const questionnairePrompts = [
  {
    id: 'focus-area',
    label: 'What money ritual needs the most momentum right now?',
    options: ['Weekly spending review', 'Debt snowball tune-up', 'Retirement projections', 'Tax prep rhythm'],
  },
  {
    id: 'support-style',
    label: 'How do you prefer guidance to show up?',
    options: ['Step-by-step walkthroughs', 'Visual dashboards', 'Checklists and reminders', 'Async expert nudges'],
  },
  {
    id: 'time-investment',
    label: 'How much time can you invest each week?',
    options: ['15 minutes', '30 minutes', '45 minutes', '60+ minutes'],
  },
]

const testimonials = [
  {
    name: 'Amelia S.',
    role: 'Founder · Denver',
    quote:
      'WalletHabit keeps our household rituals visible. We celebrate wins faster and never lose the thread on our next best move.',
  },
  {
    name: 'Jordan M.',
    role: 'Design Director · Austin',
    quote:
      'The guided workflows feel like an operating system for money habits. Every module nudges our goals forward.',
  },
  {
    name: 'Priya K.',
    role: 'Engineer · Seattle',
    quote:
      'I finally trust my cadence with finances. The weekly update hub keeps receipts, notes, and insights in one calm place.',
  },
]

const proofMetrics = [
  { label: 'Teams keeping weekly rituals', value: '2,800+' },
  { label: 'Average habit score lift in 60 days', value: '34%' },
  { label: 'Modules launched with community feedback', value: '46' },
]

export default function DevBlocks() {
  const handleQuestionnaireSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const entries = Object.fromEntries(formData.entries())
    const summary = Object.values(entries).filter(Boolean).join('\n')
    if (summary) {
      alert(`We noted your preferences:\n\n${summary}`)
    } else {
      alert('Let us know a few details so we can personalize your workspace!')
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-20 py-6">
      <section className="grid gap-12 rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-sm lg:grid-cols-[1.1fr,1fr]">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Personalized onboarding
          </span>
          <h1 className="text-4xl font-bold text-navy sm:text-5xl">A five-question check-in to tune your money system</h1>
          <p className="max-w-xl text-base text-navy/70">
            Pick the rituals that matter, set the pace that feels sustainable, and we will map the WalletHabit workspace that matches
            your energy. Your answers glow straight into your dashboard when you are ready.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-navy/70">
            <div className="flex items-center gap-2 rounded-full bg-sand px-4 py-2 font-semibold text-primary">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
              </svg>
              Takes under 2 minutes
            </div>
            <span>Instant recommendations · Export to your ritual log</span>
          </div>
        </div>

        <form
          onSubmit={handleQuestionnaireSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner"
        >
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-navy">Quick questionnaire</h2>
            <p className="text-sm text-navy/60">Answer a few prompts and preview the modules we will curate for you.</p>
          </div>

          {questionnairePrompts.map((prompt) => (
            <label key={prompt.id} htmlFor={prompt.id} className="flex flex-col gap-2 text-sm text-navy">
              <span className="font-semibold text-navy/90">{prompt.label}</span>
              <select
                id={prompt.id}
                name={prompt.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-navy/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                {prompt.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-dark"
          >
            See my guided plan
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sand/40 via-white to-white p-10 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Creative promise
            </span>
            <h2 className="text-3xl font-semibold text-navy sm:text-4xl">
              Decide to co-steer every step of your money story
            </h2>
            <p className="text-sm text-navy/80">
              You never get into a better financial position unless you take charge. You decide to get organized. You decide to improve. You decide to learn. WalletHabit is built for people who embrace continuous improvements and habits that move real life forward.
            </p>
            <p className="text-sm text-navy/80">
              We welcome you to outsource the heavy lift while you co-steer with WalletHabit.com. Onboarding is intentionally easy—even fun—with a digital teacher you choose, periodic check-ins, and gradual improvement baked into every module.
            </p>
          </div>

          <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-navy">Why members stay</h3>
              <p className="text-sm text-navy/60">Pick what fits, leave what does not, and keep everything flowing in one place.</p>
            </div>
            <ul className="grid gap-3 text-sm text-navy/80">
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Built-in personal tips and periodic check-ins keep your momentum honest.
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Access shared financial advice and habit playbooks from the entire community.
              </li>
              <li className="flex items-start gap-3">
                <svg className="mt-1 h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                One space for every financial matter, seamlessly designed across devices.
              </li>
            </ul>
            <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
              WalletHabit.com — the home for habits that make reality happen.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              Social proof
            </span>
            <h2 className="text-3xl font-semibold text-navy">Habit-builders share why the rituals stick</h2>
            <p className="text-sm text-navy/70">
              Real voices from people designing calmer money systems with WalletHabit. Drop into their stories and borrow the patterns that resonate.
            </p>
          </div>
          <div className="flex gap-6 text-center">
            {proofMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                <p className="text-2xl font-semibold text-primary">{metric.value}</p>
                <p className="mt-1 w-40 text-xs text-navy/60">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="relative flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute right-6 top-6 text-4xl text-gold/60" aria-hidden>
                “
              </div>
              <blockquote className="text-sm text-navy/80">{testimonial.quote}</blockquote>
              <figcaption className="mt-auto text-sm font-semibold text-navy">
                {testimonial.name}
                <span className="block text-xs font-normal uppercase tracking-wide text-navy/60">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-primary-dark via-navy to-midnight text-white shadow-lg">
        <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-primary/40 blur-3xl" aria-hidden />
        <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-gold/40 blur-2xl" aria-hidden />
        <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-brand/30 blur-3xl" aria-hidden />

        <div className="relative grid gap-10 px-10 py-16 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Immersive walkthrough
            </span>
            <h2 className="text-3xl font-semibold leading-snug text-white sm:text-4xl">
              Scroll the roadmap while background layers drift by. Parallax moments make every milestone feel cinematic.
            </h2>
            <p className="text-sm text-white/80">
              Move through timelines that respond as you scroll—glowing cards tilt, progress markers glide, and the system gently
              reveals what needs your attention next.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
                Timeline sync with rituals
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 6-6" />
                </svg>
                Guided nudges as you scroll
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
                </svg>
                Notes follow your progress
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 scale-110 transform bg-gradient-to-tr from-white/10 to-transparent blur-3xl" aria-hidden />
            <div className="relative grid w-full max-w-md gap-4 rounded-3xl border border-white/30 bg-white/10 p-6 backdrop-blur">
              {['Plan your kickoff ritual', 'Preview milestone checklist', 'Bookmark weekly debrief'].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white/90 shadow-lg shadow-primary/20"
                  style={{ transform: `translateY(${index * 8}px)` }}
                >
                  <span>{item}</span>
                  <span className="text-xs uppercase tracking-wide text-white/60">Parallax cue</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
