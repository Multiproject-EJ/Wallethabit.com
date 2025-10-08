# Modular Personal Finance Suite — Remote-First Development Plan

> **Purpose.** Align the build roadmap with a workflow where every change is authored by Codex and executed entirely in the cloud. Each step below assumes no local tooling — GitHub handles all installs, builds, tests, and deployments. Update the **Status** column (Not Started → In Progress → Blocked → Done) as progress is made so this document doubles as the live tracker.

---

## How to Work This Plan
- Codex edits files and pushes commits directly to GitHub; no local environment is required.
- GitHub Actions runs linting, tests, and builds automatically after each push. Treat green checks as the signal to proceed.
- Use GitHub Pages (Actions-based) for production deployments; every merge to `main` publishes the latest static build.
- If an interactive preview is needed, spin up a GitHub Codespace — it provides a cloud dev server without local installs.
- Supabase, Stripe, and other integrations are configured via their dashboards; environment keys are managed through repository secrets or Supabase project settings.

---

## Phase A — Cloud Infrastructure & DX

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | GitHub Actions Baseline | Establish automation so GitHub performs installs, builds, tests, and deployments. | “Add `.github/workflows/ci.yml` running “npm ci” + lint/tests,” “add `.github/workflows/pages.yml` that builds `app/` and deploys to GitHub Pages.” | Confirm both workflows succeed on push (green checks); review artifact logs in Actions UI. | Enable GitHub Pages (Actions workflow) and configure branch/environment; set repository secrets if needed. | Not Started |
| 1 | Repo Scaffold Review | Ensure the Vite + React + TS scaffold inside `app/` is production-ready and tracked by Actions. | “Audit existing Vite scaffold,” “adjust package scripts so CI uses `npm run lint`, `npm run test`, `npm run build`.” | Let CI workflow run on push; confirm lint/test/build jobs pass. | None. | In Progress |
| 2 | Shared Config & Formatting | Configure ESLint, Prettier, Tailwind base styles, and ensure scripts run entirely via Actions. | “Add ESLint + Prettier configs,” “define Tailwind base styles and fonts,” “update CI job to run lint + format check.” | Actions `ci` workflow should stay green; optionally review formatted diffs on GitHub. | None. | Not Started |
| 3 | Cloud Environment Variables | Create `.env.example` and document required secrets; wire Supabase client helper with placeholders. | “Add `.env.example` with Supabase/Stripe keys placeholders,” “create `services/supabase.ts` using env vars.” | CI build succeeds using placeholder-safe defaults; Supabase client compiles without runtime secrets. | Add real secrets to Supabase Dashboard and GitHub repository secrets (Pages deployment). | Not Started |

## Phase B — App Shell & Routing

| Step | Focus | Goal | Key Actions | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | Layout Skeleton | Implement responsive navbar + sidebar + layout wrapper with React Router routes from product plan. | “Create `components/layout/` folder,” “set up router in `app/src/main.tsx` with placeholder pages.” | CI unit/component tests cover layout rendering; optionally add screenshot diffs via Actions artifact. | None. | Not Started |
| 5 | Theme System | Implement `ThemeContext`, light/dark toggle, accent palette, and persistence via local storage (migrate to Supabase later). | “Build theme provider,” “expose `ThemeToggle` UI wired to context.” | Add unit tests for context defaults; ensure CI passes. | None. | Not Started |
| 6 | Module Registry | Create `ModulesContext` with metadata, feature flags, and gallery UI backed by mock data. | “Define modules registry JSON,” “build Modules Gallery page with enable/disable state.” | CI tests verifying toggle state updates; review preview via GitHub Pages once merged. | None. | Not Started |

## Phase C — Supabase Schema & Cloud Data Flow

| Step | Focus | Goal | Key Actions | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 7 | Database Schema v1 | Draft Supabase SQL migrations stored in repo and run remotely via dashboard/CLI-in-cloud. | “Author `supabase/migrations/0001_init.sql` per product spec,” “add README instructions for running migrations from Supabase UI or Codespace.” | Optional: create GitHub Action job invoking Supabase CLI with service key (if feasible); otherwise rely on Supabase migration history. | Execute migration through Supabase web console or Codespace-based CLI session. | Not Started |
| 8 | Seed Data | Provide SQL seed scripts for demo data and document how to apply them remotely. | “Add `supabase/seeds/demo.sql`,” “add npm script `seed:remote` that can run via Actions or Codespace.” | If automated, ensure CI workflow runs seed check (without mutating prod). | Run seed against Supabase dev project via dashboard or Codespace. | Not Started |
| 9 | Supabase Client Integration | Wire Supabase auth flow, contexts, and guarded routes using SDK from the frontend. | “Implement `AuthContext`, sign in/up screens, route guards.” | Component tests and mocked Supabase client tests via CI. | Configure Supabase redirect URLs and email templates in dashboard. | Not Started |

## Phase D — Dashboard & Budget Experience

| Step | Focus | Goal | Key Actions | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | Dashboard Widgets | Build Net Worth chart, Budget card, Goals card, and Insights feed using mock data or Supabase queries. | “Implement widgets with responsive Tailwind design,” “connect to contexts created earlier.” | Snapshot/component tests in CI; review deployed Pages preview. | None. | Not Started |
| 11 | Transactions CRUD | Create forms and tables for transaction management with Supabase integration and optimistic updates. | “Build `AddTransactionForm`, transactions table,” “add Zod validation.” | CI tests covering form validation and reducer logic. | Ensure Supabase RLS policies allow CRUD for authenticated users only. | Not Started |
| 12 | Budget Planner | Deliver monthly planning UI with planned vs actual tracking and carryover logic. | “Create `BudgetPage` with tabs,” “compute aggregates client-side or via Supabase view.” | CI tests for budget calculations; review UX via GitHub Pages deployment. | If using SQL views, add migration and run via Supabase dashboard. | Not Started |

## Phase E — Premium Modules & Integrations

| Step | Focus | Goal | Key Actions | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 13 | Debts Module | Implement debt tracking UI and payoff simulator with tested calculation utilities. | “Create `DebtsPage`, payoff calculators, shared chart components.” | Vitest unit tests for payoff math; CI ensures passing. | None. | Not Started |
| 14 | Savings Goals | Enable savings buckets and progress tracking integrated with dashboard goals. | “Implement `SavingsPage`, goal form, progress bars.” | Component tests; confirm Pages deployment renders correctly. | None. | Not Started |
| 15 | Stripe Upgrade Flow | Connect premium module gating with Stripe Checkout and Supabase functions. | “Add Edge Function `stripe-webhook`,” “build upgrade modal UI.” | Add integration tests in CI using mocked Stripe SDK; monitor Action logs. | Configure Stripe products, webhook endpoint, and Supabase secrets in dashboards. | Not Started |
| 16 | AI Advisor | Add Edge Function calling OpenAI and frontend reporting UI for premium users. | “Implement `ai-generate-report` function,” “create `AIAdvisorPage`.” | Unit tests for prompt builder; integration tests hitting mocked function in CI. | Store OpenAI key in Supabase secrets; monitor usage dashboard. | Not Started |

## Phase F — Quality, Analytics, Launch

| Step | Focus | Goal | Key Actions | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 17 | E2E & Accessibility | Add Playwright/Cypress smoke tests and accessibility checks run via GitHub Actions. | “Create `e2e/` tests triggered in CI,” “integrate axe-core for a11y assertions.” | Actions job executes `npm run test:e2e`; review reports stored as workflow artifacts. | None. | Not Started |
| 18 | Analytics & Telemetry | Integrate privacy-friendly analytics and error monitoring with cloud-managed keys. | “Add analytics provider wrapper,” “emit feature usage events.” | Unit tests for event helpers; ensure CI passes. | Configure analytics dashboards and keys via hosted service UI. | Not Started |
| 19 | Documentation & Runbook | Maintain README and `/docs` with remote-first onboarding, environment management, and troubleshooting. | “Update README with CI/Pages workflow details,” “document Supabase/Stripe procedures.” | Markdown lint (if configured) via CI; manual review in GitHub. | None. | Not Started |
| 20 | Launch Checklist | Final QA, performance audits, and go-live review with GitHub Pages deployment. | “Run Lighthouse via GitHub Action,” “prepare release notes,” “verify Supabase backups/monitoring.” | Review Action artifacts for Lighthouse scores; confirm production deployment success. | Final domain DNS check, enable Supabase backups. | Not Started |

---

### Tracking Notes
- After each step, log learnings, blockers, and PR links here for future reference.
- Split steps into sub-steps (e.g., 11a, 11b) if needed; keep numbering consistent to preserve history.
- Reference [PRODUCT_PLAN_PART1.md](PRODUCT_PLAN_PART1.md) and [PRODUCT_PLAN_PART2.md](PRODUCT_PLAN_PART2.md) frequently to ensure implementation matches product vision.
- Celebrate every green Actions check — they’re your signal that the cloud workflow is doing the heavy lifting. 🚀
