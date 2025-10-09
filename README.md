# 💰 WalletHabit — Personal Finance Suite

> Cloud-native, Codex-built personal finance tools.  
> Stack: Vite + Tailwind (React/TS), Supabase (auth/db), Stripe (payments).  
> Workflow: **Codex edits → GitHub Actions builds/tests → Pages deploys**. No local installs.

## 📊 Project Status Summary

| Area | Progress | Notes |
|------|----------|------|
| Overall Build | ![p](https://progress-bar.dev/20/) | Scaffolding & CI/CD bootstrap |
| Deployment | ![p](https://progress-bar.dev/100/) | Actions + Pages wired |
| Supabase | ![p](https://progress-bar.dev/10/) | SDK placeholder; secrets next |
| Stripe | ![p](https://progress-bar.dev/10/) | Checkout placeholder; secrets next |
| UI/UX | ![p](https://progress-bar.dev/15/) | Base layout scaffold |

## 🌟 Vision
WalletHabit makes budgeting, saving, and planning **clear, calm, and motivating**.  
Design principles: clarity, momentum, and honest monetization (free + fair upgrades).

## 🧭 Workflow (Codex-only)
- All code in GitHub; no local Node needed.
- Actions run `npm ci`, `lint`, `test`, `build`; Pages deploys `/app/dist`.
- Supabase & Stripe keys stored as **GitHub Secrets**.

See: [`docs/workflow_overview.md`](docs/workflow_overview.md)

## 🌐 Deploy & Hosting Notes
- The Vite source lives in [`app/`](app) to keep the root clean for docs and workflows.
- GitHub Actions builds the app into `/app/dist` and publishes it to GitHub Pages.
- After the first push, set **Settings → Pages → Build and deployment → Source = GitHub Actions**.
- If the domain still shows the repository README, manually trigger the *Build & Deploy to Pages* workflow once to seed the static site.

## 🧩 Tech
- **Frontend:** Vite + Tailwind + React/TS
- **Hosting:** GitHub Pages (via Actions)
- **Data/Auth:** Supabase (browser SDK)
- **Payments:** Stripe (Checkout/Elements)

## 🚀 Roadmap
High-level milestones tracked in [`TODO.md`](TODO.md).

## 📄 License
All rights reserved © Eivind Josefsen — WalletHabit.com

