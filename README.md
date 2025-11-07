# 💰 WalletHabit — Personal Finance Suite

> Cloud-native, Codex-built personal finance tools.  
> Stack: Vite + Tailwind (React/TS), Supabase (auth/db), Stripe (payments).  
> Workflow: **Codex edits → GitHub Actions builds/tests → Pages deploys**. No local installs.

## 📊 Project Status Summary

| Area | Progress | Notes |
|------|----------|------|
| Overall Build | ![p](https://progress-bar.dev/76/) | Landing, dashboard, budget/goals planners, bank, debt, income, investing, retirement, protection, tax, estate labs, installable PWA shell, and public status hub |
| Deployment | ![p](https://progress-bar.dev/100/) | Actions + Pages wired |
| Status & Comms | ![p](https://progress-bar.dev/72/) | Status dashboard now includes health/incident summaries mapped to Supabase tables |
| Supabase | ![p](https://progress-bar.dev/70/) | Auth, customer accounts, and module unlocks backed by Supabase (see supabase/schema.sql) |
| Stripe | ![p](https://progress-bar.dev/25/) | Checkout placeholders blocked on publishable key |
| UI/UX | ![p](https://progress-bar.dev/97/) | Home, dashboard, pricing, budget, goals, strategy lab, settings, AI copilot, bank sync, debt payoff, income boost, investment, retirement, protection, tax, estate labs, and security & trust center |
| PWA | ![p](https://progress-bar.dev/72/) | Installable manifest, offline caching, auto-update service worker, and in-app prompts |

- **New:** Dedicated PWA experience page now centralises install guidance, offline coverage, and update controls alongside the in-app prompt hub and refreshed status dashboard feed.

## 🌟 Vision
WalletHabit makes budgeting, saving, and planning **clear, calm, and motivating**.  
Design principles: clarity, momentum, and honest monetization (free + fair upgrades).

## 🧭 Workflow (Codex-only)
- All code in GitHub; no local Node needed.
- Actions run `npm ci`, `lint`, `test`, `build`; Pages deploys `/app/dist`.
- Supabase & Stripe keys stored as **GitHub Secrets**.
- Frontend linting via `npm run lint` (ESLint flat config) and formatting with `npm run format` (Prettier).

See: [`docs/workflow_overview.md`](docs/workflow_overview.md)

## 🧩 Tech
- **Frontend:** Vite + Tailwind + React/TS
- **Hosting:** GitHub Pages (via Actions)
- **Data/Auth:** Supabase (browser SDK)
- **Payments:** Stripe (Checkout/Elements)

## 🚀 Roadmap
High-level milestones tracked in [`TODO.md`](TODO.md).

## 📄 License
All rights reserved © Eivind Josefsen — WalletHabit.com

