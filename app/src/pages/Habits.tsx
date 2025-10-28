import { useEffect, useState } from 'react'

type HabitIdea = {
  name: string
  type: string
  effect: string
  rating: number
  adopters: number
  summary: string
  bestFor: string
  cadence: string
  steps: string[]
}

type ThriftPathHighlight = {
  title: string
  focus: string
  description: string
  takeaway: string
  linkLabel: string
  link: string
}

const thriftPathHighlights: ThriftPathHighlight[] = [
  {
    title: 'No-spend warmup sprint',
    focus: 'Momentum builder',
    description:
      'Pair a 5-day no-spend focus with micro-celebrations so the first week feels motivating instead of restrictive.',
    takeaway:
      'ThriftPath recommends naming the cash you protect and posting a nightly win recap to keep the sprint social.',
    linkLabel: 'See how ThriftPath runs the sprint',
    link: 'https://www.ThriftPath.com',
  },
  {
    title: 'Micro-matching savings streak',
    focus: 'Automation',
    description:
      'Match every transfer toward debt or savings with a $5 boost—tiny amounts add up when the streak stays alive.',
    takeaway:
      'Use your Habit Dashboard to log the streak and ThriftPath’s calendar template to plan the next match in advance.',
    linkLabel: 'Download the ThriftPath tracker',
    link: 'https://www.ThriftPath.com',
  },
  {
    title: 'Friday reflection prompt pack',
    focus: 'Accountability',
    description:
      'Three reflection prompts guide a quick weekly retro so you close every week knowing the smartest next move.',
    takeaway:
      'Stack it with WalletHabit’s Friday standup ritual and borrow ThriftPath’s questions to keep insights flowing.',
    linkLabel: 'Grab the prompt pack on ThriftPath',
    link: 'https://www.ThriftPath.com',
  },
]

const habitIdeas: HabitIdea[] = [
  {
    name: 'Create a bills-only account',
    type: 'Automation',
    effect: 'Keeps bill money untouchable so due dates never sneak up.',
    rating: 4.9,
    adopters: 1890,
    summary:
      'Open a second checking account that only funds recurring bills, then sweep the full amount over the day after payday.',
    bestFor: 'Households that want to stop accidental overspending of bill money.',
    cadence: 'One-time setup • 10-minute weekly glance to confirm balances.',
    steps: [
      'List every fixed bill and the average monthly amount.',
      'Schedule an automatic transfer the day after payday that covers the total due within the pay cycle.',
      'Redirect autopays to this account so your primary spending balance stays honest.',
      'Review on Fridays to capture any new subscriptions or price changes.',
    ],
  },
  {
    name: 'Payday priority sweep',
    type: 'Cash flow',
    effect: 'Moves money to goals before lifestyle creep can grab it.',
    rating: 4.8,
    adopters: 1624,
    summary:
      'Automate three transfers the morning of payday: emergency fund, debt payoff, and near-term goal sinking funds.',
    bestFor: 'Goal-driven earners who get paid on a predictable cadence.',
    cadence: 'Set once • 5-minute monthly review to adjust amounts.',
    steps: [
      'Pick three destinations (safety, debt, dream) and assign target percentages to each.',
      'Use your bank or WalletHabit rules to trigger transfers at 8 AM on payday.',
      'Note the new balances inside your dashboard to reinforce progress.',
      'Increase each transfer by 1% every quarter to stay ahead of raises.',
    ],
  },
  {
    name: '48-hour wish list',
    type: 'Spending pause',
    effect: 'Reduces impulse buys and keeps your plan flexible.',
    rating: 4.7,
    adopters: 1382,
    summary:
      'Log wants into a shared list, wait two sleeps, then buy intentionally or skip and celebrate the save.',
    bestFor: 'Couples or roommates who want fewer surprise purchases.',
    cadence: 'Daily micro check-ins • 3-minute review on Sundays.',
    steps: [
      'Create a wish list inside WalletHabit or a shared note titled “48-Hour Ideas.”',
      'When a desire hits, drop it on the list with price and why it helps.',
      'Wait 48 hours before buying; re-read your goals before deciding.',
      'Mark skipped items to see how much you redirected toward priorities.',
    ],
  },
  {
    name: 'Friday money standup',
    type: 'Reflection',
    effect: 'Keeps your numbers fresh and stress low for the weekend.',
    rating: 4.6,
    adopters: 980,
    summary:
      'Use a 15-minute Friday ritual to note wins, capture upcoming expenses, and nudge one micro-adjustment.',
    bestFor: 'Busy professionals who crave a consistent check-in.',
    cadence: '15 minutes every Friday at lunch.',
    steps: [
      'Review bank and credit alerts since Monday and tag anything unexpected.',
      'List one win, one upcoming bill, and one adjustment in your dashboard.',
      'Send yourself or a partner a two-sentence recap to lock in accountability.',
      'Queue a small celebration (playlist, snack) so the habit feels rewarding.',
    ],
  },
  {
    name: 'Cash-flow calendar review',
    type: 'Planning',
    effect: 'Lines up income timing with upcoming obligations.',
    rating: 4.5,
    adopters: 1127,
    summary:
      'Overlay paydays, bills, and events on one calendar so you can spot tight weeks a month ahead.',
    bestFor: 'Families juggling variable expenses and activities.',
    cadence: '30 minutes the first Sunday of each month.',
    steps: [
      'Export recurring bills from WalletHabit into your calendar or use the built-in timeline view.',
      'Drop paydays, birthdays, travel, and irregular costs into the same view.',
      'Highlight any week where expenses exceed income and plan mini-adjustments.',
      'Share the calendar with anyone who helps manage household money.',
    ],
  },
  {
    name: 'Micro-savings boost',
    type: 'Savings',
    effect: 'Captures spare change from daily spending.',
    rating: 4.4,
    adopters: 1540,
    summary:
      'Round up purchases to the nearest $5 and stash the difference into a high-yield savings pocket.',
    bestFor: 'People who swipe often and want effortless savings momentum.',
    cadence: 'Automatic after setup • 10-minute monthly glance.',
    steps: [
      'Enable round-ups inside WalletHabit or your bank’s automation tools.',
      'Direct the collected change to a named pocket with your next milestone.',
      'Track how many days it takes to reach $50 and celebrate the streak.',
      'Increase the round-up threshold when your budget feels steady.',
    ],
  },
  {
    name: 'Debt pulse check',
    type: 'Accountability',
    effect: 'Keeps payoff plans visible and motivating.',
    rating: 4.6,
    adopters: 1214,
    summary:
      'Update balances on the 1st and 15th, log interest saved, and note one action that accelerated progress.',
    bestFor: 'Anyone on a focused debt payoff journey.',
    cadence: '10 minutes twice a month.',
    steps: [
      'Snapshot balances inside WalletHabit or your lender portals on the 1st.',
      'Enter the new numbers and celebrate the total principal crushed so far.',
      'Plan one leverage move (refinance call, extra payment) for the next half-month.',
      'Repeat on the 15th to stay momentum-focused between statements.',
    ],
  },
  {
    name: 'Sunday meal & money prep',
    type: 'Lifestyle',
    effect: 'Aligns food choices with the budget before the week begins.',
    rating: 4.3,
    adopters: 990,
    summary:
      'Batch-plan meals, review grocery rewards, and preload your spending card with the week’s allowance.',
    bestFor: 'Households who feel food costs drifting higher each month.',
    cadence: '45 minutes every Sunday afternoon.',
    steps: [
      'Check pantry inventory and list meals that use what you already own.',
      'Redeem or clip grocery rewards and schedule pickup to avoid impulse aisles.',
      'Transfer the week’s food budget to your grocery spending card or pocket.',
      'Log one new recipe win so future Sundays feel easier.',
    ],
  },
  {
    name: 'Subscription audit sprint',
    type: 'Expense trim',
    effect: 'Frees up cash by pruning forgotten sign-ups.',
    rating: 4.2,
    adopters: 835,
    summary:
      'Once a quarter, export all active subscriptions, rate their value, and cancel or downgrade anything below a 7/10.',
    bestFor: 'Digital natives with lots of apps and memberships.',
    cadence: '60 minutes every quarter.',
    steps: [
      'Pull the subscription list from WalletHabit or your bank statement search.',
      'Score each service on value vs. cost using a quick 1–10 slider.',
      'Cancel, pause, or downgrade anything under a 7 and redirect savings to goals.',
      'Set a reminder for next quarter so the pruning stays effortless.',
    ],
  },
  {
    name: 'Future-fund autopilot',
    type: 'Investing',
    effect: 'Builds long-term wealth quietly in the background.',
    rating: 4.8,
    adopters: 1442,
    summary:
      'Schedule monthly transfers to a brokerage, align them with index fund buys, and tag each deposit with the dream it fuels.',
    bestFor: 'Long-term investors who want frictionless contributions.',
    cadence: 'Set it once • 20-minute quarterly review.',
    steps: [
      'Choose an automatic transfer date that lands right after payday cushion hits.',
      'Split contributions across taxable and retirement accounts if needed.',
      'Automate the investment into a diversified fund or target-date portfolio.',
      'Name each goal inside WalletHabit so you see the story behind the numbers.',
    ],
  },
]

export default function Habits() {
  const [selectedHabit, setSelectedHabit] = useState<HabitIdea | null>(null)

  useEffect(() => {
    if (!selectedHabit) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedHabit(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedHabit])

  return (
    <div className="flex flex-1 flex-col gap-12 pb-20">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50 px-6 py-12 shadow-sm sm:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 text-center">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            WalletHabit rituals
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Build money habits that feel natural and actually stick.
          </h1>
          <p className="text-lg text-navy/70 sm:text-xl">
            Start with a personalized assessment, design routines that match your energy, and keep the momentum inside your Habit Dashboard.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/assistant?flow=habit-fit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Take the Habit Fit Questionnaire
            </a>
            <a
              href="/onboarding?mode=habit-designer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              Launch the Habit Designer
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-10 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <span className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:self-start">
            ThriftPath spotlight
          </span>
          <div className="flex flex-col gap-3 text-center sm:max-w-3xl sm:text-left">
            <h2 className="text-2xl font-semibold text-navy sm:text-3xl">Best of ThriftPath habits & hacks</h2>
            <p className="text-sm text-navy/70 sm:text-base">
              We pulled the most-loved ThriftPath playbooks into WalletHabit so you can try their crowd-tested rituals without leaving your dashboard. Borrow the moves, remix them, and keep the wins visible inside your Habit Dashboard.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="https://www.ThriftPath.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Visit ThriftPath.com
            </a>
            <span className="text-xs text-navy/60">Community favorites refreshed weekly.</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {thriftPathHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {highlight.focus}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-navy">{highlight.title}</h3>
                <p className="text-sm text-navy/80">{highlight.description}</p>
                <p className="text-sm text-navy/60">{highlight.takeaway}</p>
              </div>
              <a
                href={highlight.link}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
              >
                {highlight.linkLabel}
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 15L15 5" />
                  <path d="M7 5h8v8" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-navy">Why start with a questionnaire?</h2>
          <p className="text-sm text-navy/70">
            The questionnaire filters your answers through WalletHabit’s behavior design engine. It scores your time, energy, and money personality to recommend rituals that fit your life, not just your budget.
          </p>
          <ul className="space-y-4 text-sm text-navy/80">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                1
              </span>
              Answer 12 quick prompts about stress triggers, deadlines, and wins.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                2
              </span>
              Receive a scorecard with the three habit archetypes that suit you best.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                3
              </span>
              Spin up the Habit Designer to customize cadence, automations, and accountability nudges.
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/80 p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-emerald-900">Your Habit Dashboard</h3>
            <p className="text-sm text-emerald-900/80">
              Every account includes a habit dashboard that tracks streaks, upcoming nudges, and the savings unlocked by your routines. Sync it with your bank feeds or update manually—either way, the story stays visible.
            </p>
          </div>
          <a
            href="/account/habits"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-400 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-100"
          >
            Explore the dashboard preview
          </a>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-navy">Habit inspiration table</h2>
            <p className="text-sm text-navy/70">Tap any habit to open the playbook. These are the first 10—we’ll keep expanding the library.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-navy/70 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            Load more habits soon
          </button>
        </div>

        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 md:block">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th scope="col" className="px-6 py-4">Habit</th>
                <th scope="col" className="px-6 py-4">Type</th>
                <th scope="col" className="px-6 py-4">Effect</th>
                <th scope="col" className="px-6 py-4">Rating</th>
                <th scope="col" className="px-6 py-4">Adopted by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm text-navy/80">
              {habitIdeas.map((habit) => (
                <tr
                  key={habit.name}
                  className="cursor-pointer transition hover:bg-emerald-50/70"
                  onClick={() => setSelectedHabit(habit)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy">{habit.name}</span>
                      <span className="text-xs text-navy/60">{habit.summary}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-navy/80">{habit.type}</td>
                  <td className="px-6 py-4">{habit.effect}</td>
                  <td className="px-6 py-4 font-medium text-emerald-700">{habit.rating.toFixed(1)} ★</td>
                  <td className="px-6 py-4">{habit.adopters.toLocaleString()} members</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {habitIdeas.map((habit) => (
            <button
              key={habit.name}
              type="button"
              onClick={() => setSelectedHabit(habit)}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/70"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-navy">{habit.name}</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{habit.type}</span>
              </div>
              <p className="text-sm text-navy/70">{habit.effect}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-navy/60">
                <span>{habit.rating.toFixed(1)} ★ rating</span>
                <span>{habit.adopters.toLocaleString()} members</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedHabit ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="habit-details-title"
          onClick={() => setSelectedHabit(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-emerald-300 hover:text-emerald-700"
              onClick={() => setSelectedHabit(null)}
              aria-label="Close habit details"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 id="habit-details-title" className="text-2xl font-semibold text-navy">
                  {selectedHabit.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-emerald-700/80">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{selectedHabit.type}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{selectedHabit.rating.toFixed(1)} ★ community rating</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{selectedHabit.adopters.toLocaleString()} members</span>
                </div>
                <p className="text-sm text-navy/70">{selectedHabit.summary}</p>
              </div>
              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-navy/80 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Best for</p>
                  <p>{selectedHabit.bestFor}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cadence</p>
                  <p>{selectedHabit.cadence}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-navy">How to run it</p>
                <ul className="space-y-2 text-sm text-navy/80">
                  {selectedHabit.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Bring it into your dashboard</p>
                <p>
                  Add this habit to your WalletHabit dashboard to unlock streak tracking, automated nudges, and community tips tailored to your progress.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                  >
                    Open my dashboard
                  </a>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100"
                    onClick={() => setSelectedHabit(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

