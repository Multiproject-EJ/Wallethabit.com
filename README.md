# 💰 Project: FutureFunds Personal Finance Suite

> An AI-assisted, modular personal finance ecosystem built entirely through **Codex + GitHub**, integrated with **Supabase** (data) and **Stripe** (payments), and focused on empowering users to master budgeting, saving, investing, and long-term planning.

---

## 🌟 Vision

Create a **beautifully simple, data-driven personal finance suite** that feels like a companion — not a spreadsheet.  
It combines psychology, automation, and education to help users grow their money confidence through insight, planning, and AI guidance.

---

## 🧭 Working Philosophy

- **Codex-first**: All development happens through ChatGPT Codex; no local setup.
- **GitHub-native**: Source, CI/CD, docs, and tasks all live in this repo.
- **Cloud-executed**: GitHub Actions handles builds and deploys; Supabase + Stripe handle back-end needs.
- **Design-driven**: Every feature prioritizes clarity, motivation, and emotional resonance.
- **Iterative**: Start small, validate early, evolve continuously.

For workflow details, see [`docs/workflow_overview.md`](docs/workflow_overview.md) or refer to my [Global Codex Development README](link-to-shared-template).

---

## 💼 Product Research Summary

**Goal:** Deliver a personal finance experience that users *love*, *trust*, and *recommend*.

**Key principles from research (YNAB, Monarch, Copilot, Mint, etc.):**

| Area | Best Practice | Why It Works |
|------|----------------|--------------|
| **User onboarding** | Quick start with default budget templates | Reduces friction; instant progress feeling |
| **Visualization** | Beautiful dashboards & timelines | Keeps emotional engagement high |
| **Automation** | Smart categorization & sync with banks | Saves users time |
| **AI feedback** | Natural-language summaries, encouragement | Personalizes experience |
| **Education** | “Why” explanations built into actions | Converts usage into learning |
| **Monetization** | Transparent one-time tiers + optional upgrades | Feels fair; reduces churn |
| **Retention** | Habit tracking, streaks, rewards | Encourages consistent use |

---

## 💡 Core Features (Initial Scope)

1. **Unified Dashboard**
   - Net worth, budgets, and upcoming bills overview.

2. **Smart Budgeting**
   - Envelope system with AI suggestions based on user history.

3. **Goal Planner**
   - Visual trackers for savings, investments, and milestones.

4. **AI Assistant**
   - Built-in Codex-style chat for financial insights, DCF simulations, and “what if” scenarios.

5. **Supabase Sync**
   - Secure storage of user data (transactions, preferences, goals).

6. **Stripe Payments**
   - Tiered memberships (free / premium / lifetime) with clean upgrade flow.

---

## 💰 Monetization Strategy

| Tier | Pricing | Features |
|------|----------|----------|
| Free | $0 | Core budgeting, visual goals, AI summaries |
| Premium | $4.99/mo | Cloud sync, export tools, AI forecasting |
| Lifetime | $49 | One-time payment, full unlock |
| Pro (future) | $99/year | Investor-grade analytics + portfolio tracking |

Fair pricing that **scales with value** — no lock-ins, no dark patterns.

---

## 🧪 UX & Design Philosophy

- “**Clarity through calm.**”  
  Minimalist dashboards, neutral colors, gentle animations.

- “**Numbers that feel alive.**”  
  Every chart or number tells a story — not just data, but progress.

- “**Emotional design.**”  
  Use colors, badges, and AI encouragement to trigger motivation, not guilt.

---

## 🧠 Tech Stack Summary

| Layer | Tool | Role |
|-------|------|------|
| Frontend | Vite + Tailwind + (React/TS optional) | Responsive UI |
| Hosting | GitHub Pages (Actions-based) | CI/CD + static deployment |
| Database/Auth | Supabase | User data + secure sessions |
| Payments | Stripe | Subscriptions + one-time unlocks |
| AI | Codex (ChatGPT) | Build + iteration assistant |
| Analytics (later) | Plausible or Supabase Edge | Privacy-focused tracking |

---

## 🚀 Roadmap (Living To-Do List)

### ✅ Phase 1 — Foundation
- [x] Repo setup with Codex-first structure
- [x] GitHub Actions for CI/CD (build + deploy)
- [x] Supabase project connection
- [ ] Stripe API keys & test checkout
- [ ] Core UI scaffolding (dashboard, router, layout)
- [ ] Basic budget planner prototype

### ⏳ Phase 2 — Smart Features
- [ ] AI budgeting assistant
- [ ] Transaction import and tagging
- [ ] Supabase data sync
- [ ] Chart components (spending, savings, goals)

### 🧭 Phase 3 — Monetization & Scaling
- [ ] Stripe premium tier integration
- [ ] Marketing site and pricing page
- [ ] Referral & sharing system
- [ ] Add analytics + feedback loop

### 🌍 Phase 4 — Expansion
- [ ] Multi-language support
- [ ] Team / Family budgets
- [ ] API integration for bank data
- [ ] Desktop app build

---

## 🧩 Codex Collaboration Notes

When using Codex:
- Ask for *full replacement-ready files* for clarity.
- Prefer descriptive commits (e.g., `feat: add savings tracker chart`).
- Keep readme + todo updated after each phase.
- Review GitHub Actions logs for green ✅ status before moving on.

---

## 🗂️ Reference Docs
- [`docs/product_research.md`](docs/product_research.md)
- [`docs/feature_specs.md`](docs/feature_specs.md)
- [`docs/monetization_strategies.md`](docs/monetization_strategies.md)

---

## 📅 Versioning

| Version | Focus | Status |
|----------|--------|--------|
| `v0.1.0` | Repo setup, CI/CD, base UI | ✅ Done |
| `v0.2.0` | Stripe + Supabase integration | 🚧 In progress |
| `v0.3.0` | AI and analytics features | 🧠 Planned |
| `v1.0.0` | Public release | 🌟 Coming soon |

---

## 📜 License
All rights reserved © Eivind Josefsen — FutureFunds.ai  
Developed entirely through **Codex + GitHub + Cloud Automation**.
