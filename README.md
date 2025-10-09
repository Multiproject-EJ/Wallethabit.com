# 💰 WalletHabit — Personal Finance Suite

> Cloud-native, Codex-built personal finance tools.  
> Stack: Vite + Tailwind (React/TS), Supabase (auth/db), Stripe (payments).  
> Workflow: **Codex edits → GitHub Actions builds/tests → Pages deploys**. No local installs.

## 📊 Project Status Summary

| Area | Progress | Notes |
|------|----------|------|
| Overall Build | ![p](https://progress-bar.dev/50/) | Landing, dashboard, budget & goals planners, bank sync lab |
| Deployment | ![p](https://progress-bar.dev/100/) | Actions + Pages wired |
| Supabase | ![p](https://progress-bar.dev/30/) | Browser client booted; waiting on secrets |
| Stripe | ![p](https://progress-bar.dev/25/) | Checkout placeholders blocked on publishable key |
| UI/UX | ![p](https://progress-bar.dev/78/) | Home, dashboard, pricing, budget, goals, strategy lab, settings, AI copilot, bank sync lab, and debt payoff lab |

## 🌟 Vision
WalletHabit makes budgeting, saving, and planning **clear, calm, and motivating**.  
Design principles: clarity, momentum, and honest monetization (free + fair upgrades).

## 🧭 Workflow (Codex-only)
- All code in GitHub; no local Node needed.
- Actions run `npm ci`, `lint`, `test`, `build`; Pages deploys `/app/dist`.
- Supabase & Stripe keys stored as **GitHub Secrets**.

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

