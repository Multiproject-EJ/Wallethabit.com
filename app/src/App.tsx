import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const featureHighlights = [
  {
    icon: ShieldCheck,
    title: 'Privacy-first architecture',
    description: 'Own your data with transparent controls, modular permissions, and secure Supabase foundations.',
  },
  {
    icon: Sparkles,
    title: 'Modular intelligence',
    description: 'Activate only the money modules you need today, then layer on AI insights as your habits evolve.',
  },
  {
    icon: ArrowRight,
    title: 'Roadmap in motion',
    description: 'Dashboard, budgets, debt payoff, savings goals, and more are queued in the upcoming build phases.',
  },
];

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <header className="relative px-6 py-10 sm:px-12">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-24 left-12 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
        </div>
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold text-primary-100">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-lg font-bold text-white shadow-glow">
              WH
            </span>
            <span className="font-display tracking-wide">Wallethabit</span>
          </div>
          <a
            className="hidden rounded-full border border-primary-500/50 px-4 py-2 text-sm font-medium text-primary-100 transition hover:border-primary-400 hover:text-white sm:inline-flex"
            href="#roadmap"
          >
            View Roadmap
          </a>
        </nav>
        <div className="mx-auto mt-16 max-w-4xl text-center text-balance text-primary-50">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-100">
            Building the modular personal finance suite
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Crafting habits that grow wealth, one module at a time.
          </h1>
          <p className="mt-6 text-lg text-primary-100 md:text-xl">
            This is the starting line for Wallethabit — an opinionated personal finance OS being built in phases. Follow along as
            the design system, Supabase-powered data layer, and habit-driven modules come to life.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
              href="https://github.com/your-org"
            >
              Follow the build
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 px-6 py-3 text-sm font-semibold text-primary-100 transition hover:border-primary-300 hover:text-white"
              href="mailto:hello@wallethabit.com"
            >
              Request early access
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-6 pb-16 sm:px-12">
        <section
          id="roadmap"
          className="mt-12 grid gap-6 rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-lg sm:grid-cols-3"
        >
          {featureHighlights.map(({ icon: Icon, title, description }) => (
            <article key={title} className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-200">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-sm leading-relaxed text-primary-100">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Phase A → Developer Foundations</h2>
              <p className="mt-2 max-w-xl text-sm text-primary-100">
                Vite + React + Tailwind scaffold is in place. Next up: dial in linting, formatting, and Supabase scaffolding so the
                dashboard, budgeting, and AI-driven modules have a reliable launchpad.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-primary-100 transition hover:bg-white/15"
              href="../docs/DEVELOPMENT_PLAN.md"
            >
              Peek at the build plan
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-10 text-sm text-primary-200 sm:px-12">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Wallethabit. Crafted for mindful money habits.</p>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary-300">
            <span>Phase A</span>
            <span className="h-1 w-1 rounded-full bg-primary-400" />
            <span>Foundations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
