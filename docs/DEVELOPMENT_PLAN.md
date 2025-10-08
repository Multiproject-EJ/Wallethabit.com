# Modular Personal Finance Suite — Development Plan

> **Purpose.** Translate the product and technical plans into a vibe-friendly execution roadmap that you and Codex can follow step by step. Each step calls out the goal, required artifacts, suggested prompts, verification checks, and any manual/offline tasks. Update the **Status** column as work progresses (Not Started → In Progress → Blocked → Done) so the roadmap doubles as a living tracker.

---

## How to Use This Plan
- Start at Step 1 and move sequentially unless a dependency is marked optional.
- Every step includes testing or validation guidance — run the listed checks before marking a step complete.
- When a task requires action outside the repository (e.g., running SQL in Supabase, configuring Stripe), the **Out-of-Band Actions** column explains exactly what to do.
- Prompts and notes are written to help with a “vibe-coding” workflow: keep momentum by shipping small slices, reviewing the UI visually, and celebrating quick wins.

---

## Phase A — Foundations & Developer Experience

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Repository Baseline | Create the Vite + React + TS scaffold inside `app/` and initialize Tailwind. | “Generate Vite React-TS project”, “configure Tailwind with base styles, fonts, accent palette placeholders.” Commit initial scaffold. | `npm run lint`, `npm run test` (Vitest sample), start dev server and confirm landing page renders. | None. | In Progress (awaiting dependency install for verification) |
| 2 | Developer Tooling | Add ESLint + Prettier config, Tailwind base styles, and script aliases (`dev`, `build`, `test`, `lint`). | “Add ESLint config matching React + Tailwind best practices”, “create Prettier config if desired.” | `npm run lint`, `npm run format:check` (if added), ensure builds succeed. | None. | Not Started |
| 3 | Supabase Project Link | Install Supabase CLI, initialize local config, and add `.env.example` with placeholders from Part 2. | “Create .env.example with keys from spec,” “set up Supabase client helper (`services/supabase.ts`).” | `supabase --version` (CLI available), `npm run typecheck` (if configured) to ensure env typings compile. | Run `supabase init` locally; create Supabase project via dashboard; paste project URL and anon key into personal `.env` (not committed). | Not Started |

## Phase B — Core Architecture & Layout

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 4 | App Shell | Implement responsive layout with navbar, collapsible sidebar, and placeholder content areas. | “Create `Navbar`, `Sidebar`, `Layout` components,” “wire React Router with placeholder routes from spec.” | `npm run test` for layout snapshot/component tests; manually verify in browser dev server (mobile + desktop widths). | None. | Not Started |
| 5 | Theme & Personalization | Add `ThemeContext`, light/dark toggle, accent color support, and persist choice via Supabase profile mock or local storage stub. | “Build theme context with Tailwind CSS variables,” “create `ThemeToggle` component.” | Unit tests for context default, manual check toggling theme in browser. | Later replace local storage stub with real profile data once Supabase tables exist. | Not Started |
| 6 | Module Toggle Framework | Establish `ModulesContext` with available module metadata, gating badges, and sample data for dashboard widgets. | “Create modules registry JSON,” “display Modules Gallery page with cards + enable/disable state (local state for now).” | Component tests verifying toggle state updates, manual UX check. | None. | Not Started |

## Phase C — Data Layer & Supabase Schema

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 7 | Database Schema v1 | Author `supabase/migrations/0001_init.sql` covering tables + policies from spec. | “Draft SQL migration using schema in Part 2,” “include RLS and basic policies for `profiles`, `accounts`, `transactions`, `modules_enabled`, etc.” | Run `supabase db reset` locally; `supabase db lint`; optional `psql` queries to ensure tables exist. | Execute migration against Supabase project (`supabase db push`). | Not Started |
| 8 | Seed & Fixtures | Create seed scripts or SQL to insert demo data for local development (one user, accounts, transactions). | “Add `supabase/seed/demo.sql`,” “write npm script to run `supabase db remote commit` or local copy.” | Run seed locally and confirm data visible via Supabase Studio; `npm run dev` verifying dashboard placeholders consume seed (mock fetch). | None. | Not Started |
| 9 | Supabase Client Integration | Connect frontend auth flow to Supabase: sign in/up pages, `AuthContext`, secure route guard. | “Implement auth pages with Supabase client,” “create hooks for `useSupabase`, `useAuth`.” | Component tests for auth forms (React Testing Library), manual signup/signin via local Supabase dev server. | Configure Supabase Auth email templates if desired; set redirect URL. | Not Started |

## Phase D — Dashboard & Budget MVP

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | Dashboard Widgets | Implement Net Worth chart (mock data), Budget card, Goals card, Insights feed placeholder pulling from contexts. | “Create `NetWorthChart`, `BudgetCard`, `GoalsCard`, `InsightsFeed` with responsive design.” | Unit/component tests for rendering with sample props; storybook stories (optional) for visual check. | None. | Not Started |
| 11 | Transactions CRUD | Build `AddTransactionForm`, transactions table/list, and integrate Supabase CRUD with optimistic updates. | “Use Zod for validation,” “update budget actuals view or local calc on submission.” | `npm run test` for form validation tests; manual add/edit/delete via dev server verifying Supabase entries. | Ensure Supabase Row Level Security covers operations (attempt cross-user request via CLI). | Not Started |
| 12 | Budget Planner | Implement monthly budget setup UI, planned vs actual view, and carryover logic (front-end). | “Create `BudgetPage` with tabs for planning/review,” “pull aggregated actuals from Supabase view or local compute.” | Unit tests for carryover calculations, component tests for tab rendering; manual review of one-month cycle. | If using SQL views (`vw_budget_actuals`), create migration and refresh triggers. | Not Started |

## Phase E — Enhancements & Integrations

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 13 | Debts Module (Phase 2 starter) | Implement debt tracking UI, payoff simulator (Avalanche/Snowball), and integrate with dashboard. | “Create `DebtsPage` with cards, calculators,” “share utility for payoff math with tests.” | Vitest unit tests for payoff calculator; component test ensuring UI renders with sample data. | None. | Not Started |
| 14 | Savings Goals Module | Enable savings buckets with progress bars and goal tracking. | “Implement `SavingsPage`, `AddGoalForm`, progress components.” | Component tests for goal completion logic; manual check linking to dashboard Goals card. | None. | Not Started |
| 15 | Stripe Integration | Wire Upgrade flow with Stripe Checkout, Supabase subscription sync, and module gating for premium features. | “Create Edge Function `stripe-webhook`,” “frontend upgrade modal + success handling.” | Local webhook tests via Stripe CLI (`stripe listen --forward-to ...`), automated contract tests for webhook handler. | Configure Stripe products/prices in dashboard; set secrets in Supabase. | Not Started |
| 16 | AI Advisor (Premium) | Build Edge Function `ai-generate-report`, prompt templates, and UI to display reports. | “Implement Supabase function calling OpenAI,” “create `AIAdvisorPage` to list/report insights.” | Unit tests for prompt builder (pure functions), integration test hitting Edge Function with mocked OpenAI, manual UI review. | Store OpenAI key in Supabase secrets; monitor usage. | Not Started |

## Phase F — Quality, Analytics, Launch Prep

| Step | Focus | Goal | Key Actions (Codex Prompts / Tasks) | Verification & Tests | Out-of-Band Actions | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 17 | E2E & Accessibility | Add Playwright/Cypress smoke tests (auth, add transaction, dashboard update) and accessibility audits. | “Generate Playwright tests,” “add `axe-core` checks for key pages.” | `npm run test:e2e`, `npm run lint:a11y` (if configured); manual keyboard nav check. | Set up CI (GitHub Actions) to run test matrix. | Not Started |
| 18 | Analytics & Telemetry | Integrate privacy-friendly analytics (PostHog or Umami), error logging (Sentry), and feature usage events. | “Add analytics provider wrapper,” “log module toggles/upgrades.” | Ensure analytics events fire in dev console; unit test event helper functions. | Create analytics account(s); insert API keys via environment variables. | Not Started |
| 19 | Documentation & Runbook | Update README with setup instructions, add `/docs` updates (ERD diagrams, API contracts), and document testing strategy. | “Revise README to include dev setup, scripts, Supabase instructions,” “generate architecture diagrams if helpful.” | Markdown lint (if available); manual review ensuring instructions are accurate. | None. | Not Started |
| 20 | Launch Checklist | Final QA pass, performance budget checks, deploy to hosting (Netlify/Vercel), confirm Supabase policies & backups. | “Run Lighthouse,” “prepare release notes,” “toggle feature flags for launch modules.” | Lighthouse report ≥ targeted scores, manual regression, confirm production logs clean. | Deploy frontend, configure domain, enable Supabase backups/monitoring. | Not Started |

---

### Tracking Notes
- Update this document after each completed step with learnings, blockers, or links to PRs.
- If a step feels too large, split it into sub-steps underneath the table and keep the numbering stable (e.g., 11a, 11b) so history stays readable.
- Keep referencing [Part 1](PRODUCT_PLAN_PART1.md) and [Part 2](PRODUCT_PLAN_PART2.md) to ensure feature intent matches implementation.

Happy vibe-coding — celebrate each checkbox you flip to **Done**! 🎉
